from manim import (
    DOWN,
    LEFT,
    RIGHT,
    UL,
    Create,
    Indicate,
    RoundedRectangle,
    Scene,
    Text,
    VGroup,
    config,
)

PROMPT = "Ana are"
TOKENS = ["mere", "roșii", "și", "guste"]
END = "<end>"

TOKEN_FILL = "#d5e8d4"
TOKEN_STROKE = "#82b366"
PROMPT_FILL = "#f8cecc"
PROMPT_STROKE = "#b85450"


def chip(text: str, fill: str, stroke: str) -> VGroup:
    body = Text(text, font="monospace", font_size=36)
    pad = 0.18
    box = RoundedRectangle(
        width=body.width + pad * 2,
        height=body.height + pad * 2,
        corner_radius=0.08,
        fill_color=fill,
        fill_opacity=1.0,
        stroke_color=stroke,
        stroke_width=2,
    )
    return VGroup(box, body).move_to(box.get_center())


class TokenGeneration(Scene):
    def construct(self):
        title = Text("predict → add → feed it back", font_size=32).to_edge(UL, buff=0.4)
        self.play(Create(title), run_time=0.8)

        prompt = chip(PROMPT, PROMPT_FILL, PROMPT_STROKE)
        prompt.next_to(title, DOWN, aligned_edge=LEFT, buff=0.5)
        self.play(Create(prompt), run_time=0.6)

        tokens = []
        for token in TOKENS + [END]:
            new_chip = chip(token, TOKEN_FILL, TOKEN_STROKE)
            if tokens:
                new_chip.next_to(tokens[-1], RIGHT, buff=0.12)
            else:
                new_chip.next_to(prompt, RIGHT, buff=0.12)
            tokens.append(new_chip)

        row = VGroup(*tokens)
        if row.width > config.frame_width - 1:
            row.set(width=config.frame_width - 1).next_to(prompt, RIGHT, buff=0.12)

        for index, next_chip in enumerate(tokens):
            self.play(Indicate(prompt), run_time=0.4)
            self.play(Create(next_chip), run_time=0.6)
            if next_chip is tokens[-1]:
                label = Text("stop token", font_size=24).next_to(next_chip, DOWN, buff=0.2)
                self.play(Create(label), run_time=0.5)