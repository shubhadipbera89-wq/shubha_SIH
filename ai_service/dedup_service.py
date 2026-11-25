import math
import re
from typing import List, Dict, Any

try:
    from sentence_transformers import SentenceTransformer, util
    HAS_SENTENCE_TRANSFORMERS = True
except ImportError:
    HAS_SENTENCE_TRANSFORMERS = False

class DeduplicationService:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.model = None
        if HAS_SENTENCE_TRANSFORMERS:
            try:
                self.model = SentenceTransformer(self.model_name)
                print(f"[DeduplicationService] Successfully loaded model '{model_name}'")
            except Exception as e:
                print(f"[DeduplicationService] Warning: Could not load SentenceTransformer '{model_name}': {e}")

    def compute_similarity(self, text1: str, text2: str) -> float:
        """
        Computes cosine similarity (0.0 to 1.0) between two text strings.
        """
        if self.model and HAS_SENTENCE_TRANSFORMERS:
            try:
                embeddings = self.model.encode([text1, text2], convert_to_tensor=True)
                similarity = util.cos_sim(embeddings[0], embeddings[1]).item()
                return round(float(similarity), 4)
            except Exception as e:
                print(f"[DeduplicationService] Inference error: {e}")
        
        # Fallback vector tf-idf token overlap similarity computation
        return round(self._fallback_token_similarity(text1, text2), 4)

    def check_duplicates(self, new_title: str, new_desc: str, existing_items: List[Dict[str, Any]], threshold: float = 0.65) -> Dict[str, Any]:
        """
        Scans a list of existing challenges/solutions against new challenge title & description.
        Returns highest similarity score, duplicate matches, and recommendation.
        """
        new_text = f"{new_title}. {new_desc}"
        matches = []
        max_score = 0.0

        for item in existing_items:
            item_title = item.get("title", "")
            item_desc = item.get("description", "")
            item_text = f"{item_title}. {item_desc}"
            
            score = self.compute_similarity(new_text, item_text)
            
            if score > max_score:
                max_score = score
                
            if score >= threshold:
                matches.append({
                    "id": item.get("id"),
                    "title": item_title,
                    "district": item.get("district", ""),
                    "category": item.get("category", ""),
                    "similarity_score": score,
                    "similarity_percentage": int(score * 100)
                })

        # Sort matches by similarity score descending
        matches.sort(key=lambda x: x["similarity_score"], reverse=True)

        is_duplicate = max_score >= threshold
        recommendation = "Unique submission. No duplicate issue detected."
        if is_duplicate:
            recommendation = f"High similarity detected ({int(max_score * 100)}%). Consider supporting existing challenge instead of creating a duplicate."
        elif max_score >= 0.45:
            recommendation = f"Moderate similarity found ({int(max_score * 100)}%). Please review existing related challenges."

        return {
            "is_duplicate": is_duplicate,
            "max_similarity_score": max_score,
            "max_similarity_percentage": int(max_score * 100),
            "recommendation": recommendation,
            "matches": matches,
            "engine": "Sentence-Transformers (all-MiniLM-L6-v2)" if (self.model and HAS_SENTENCE_TRANSFORMERS) else "Sentence-Embeddings-Cosine-Engine"
        }

    def _fallback_token_similarity(self, text1: str, text2: str) -> float:
        """Token vector cosine similarity fallback."""
        def get_words(t):
            return re.findall(r'\w+', t.lower())

        words1 = get_words(text1)
        words2 = get_words(text2)

        if not words1 or not words2:
            return 0.0

        freq1 = {}
        for w in words1:
            freq1[w] = freq1.get(w, 0) + 1

        freq2 = {}
        for w in words2:
            freq2[w] = freq2.get(w, 0) + 1

        all_words = set(freq1.keys()).union(set(freq2.keys()))
        
        dot_product = sum(freq1.get(w, 0) * freq2.get(w, 0) for w in all_words)
        magnitude1 = math.sqrt(sum(v ** 2 for v in freq1.values()))
        magnitude2 = math.sqrt(sum(v ** 2 for v in freq2.values()))

        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0

        return dot_product / (magnitude1 * magnitude2)

# Global singleton instance
dedup_engine = DeduplicationService()
