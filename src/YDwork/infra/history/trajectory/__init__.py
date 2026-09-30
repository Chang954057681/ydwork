"""Harness stream → trajectory event projection."""

from YDwork.infra.history.trajectory.projector import project_harness_chunk
from YDwork.infra.history.trajectory.types import TrajectoryEvent, TrajectoryKind

__all__ = ["TrajectoryEvent", "TrajectoryKind", "project_harness_chunk"]
