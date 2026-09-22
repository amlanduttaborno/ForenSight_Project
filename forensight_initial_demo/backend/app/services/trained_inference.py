"""Integration point for the final trained multimodal checkpoint.

Do not enable this until:
1. AutoSplice image/mask/caption mapping is corrected.
2. The model is retrained.
3. Held-out test metrics are validated.
4. Single-image inference is re-tested.
"""

from pathlib import Path


class TrainedInferenceEngine:
    def __init__(self, checkpoint_path: str):
        self.checkpoint_path = Path(checkpoint_path)
        if not self.checkpoint_path.exists():
            raise FileNotFoundError(self.checkpoint_path)

    def analyze(self, *args, **kwargs):
        raise NotImplementedError(
            "Final multimodal checkpoint integration is intentionally disabled in the initial supervisor demo."
        )
