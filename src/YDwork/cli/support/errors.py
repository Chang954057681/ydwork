"""CLI error helpers."""

from __future__ import annotations

from typing import NoReturn

import click

from YDwork.infra.errors import YDworkError


def fail_octop(exc: YDworkError) -> NoReturn:
    click.echo(f"error: {exc.message}", err=True)
    raise SystemExit(1) from exc
