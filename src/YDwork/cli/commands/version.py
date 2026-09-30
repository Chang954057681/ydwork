"""ydwork version command."""

from __future__ import annotations

import click


@click.command("version")
def version() -> None:
    """Show the installed ydwork version."""
    try:
        from importlib.metadata import version as _v

        v = _v("ydwork")
    except Exception:
        v = "unknown"
    click.echo(f"ydwork v{v}")
