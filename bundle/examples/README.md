# Example AI prompts

These illustrate how to use the bundle with `RULES.md`. The AI derives answers from data — nothing is hardcoded.

## Progression planning

> Goal: Bandos godsword. Account: Attack 3, Strength 3, members.
> Follow RULES.md. Use graph prerequisites + wiki intel. Discover quest XP, training spots, and gear from the index — do not assume fixed paths.

## Item lookup chain

> What materials do I need to craft a Godsword blade? Trace `requires_material` edges backward and cite each wiki page.

## Boss requirements

> What do I need before fighting General Graardor? Load the monster node intel and strategy subpage from the index.

## Quest ordering

> I want to complete Ritual of the Mahjarrat. Build a quest prerequisite chain from graph `requires_quest` edges and quest page wikitext.

## Generic wiki Q&A

> Explain how the Evolution of Combat works. Search the index for relevant pages and synthesize from wikitext.
