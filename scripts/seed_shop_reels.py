"""Additive demo reels seeder for ONE existing shop (companion of seed_shop_catalog.py).

Run inside the backend container:
  docker cp seed_reels <ctr>:/tmp/seed_reels
  docker exec -i <ctr> env PYTHONPATH=/app python - < scripts/seed_shop_reels.py
Idempotent by caption: existing captions in the shop are skipped.
"""
from __future__ import annotations

import asyncio
import sys
from pathlib import Path
from uuid import UUID

from sqlalchemy import select

from app.application.reels.reels_service import ReelsService
from app.infrastructure.db.models import ProductModel
from app.infrastructure.db.session import AsyncSessionFactory
from app.models.reels import ReelsVideoModel

SHOP_ID = UUID("f1b8ba42-0dfd-420c-9ada-3b171ea85ed2")
DIR = Path("/tmp/seed_reels")

# (file id, duration s, caption, hashtags, tagged product names)
R = [
    ("8322393", 18.8, "Yangi kolleksiya keldi! Kurtka va paltolar bozor narxida 🔥",
     ["kurtka", "palto", "yangi", "bozorliii"], ["Charm kurtka (erkaklar)", "Tuya rangli palto", "Bordo palto (ayollar)"]),
    ("7680438", 25.6, "Bahor-kuz uchun eng zo'r kiyimlar. Tanlang va buyurtma bering 🛍️",
     ["kiyim", "moda", "ayollar", "bozorliii"], ["To'qilgan kardigan (ayollar)", "Atlas pushti bluzka", "Yirtiq jinsi shim (ayollar)"]),
    ("7679422", 28.0, "Ranglar va uslublar — o'zingizga mosini toping ✨",
     ["bluzka", "yubka", "uslub", "bozorliii"], ["Qizil bluzka va qora yubka", "Oq bluzka va kulrang yubka", "Qizlar sariq yubka (tul)"]),
]


async def main() -> None:
    async with AsyncSessionFactory() as s:
        have = set((await s.execute(select(ReelsVideoModel.caption).where(ReelsVideoModel.shop_id == SHOP_ID))).scalars().all())
        rows = (await s.execute(select(ProductModel.name, ProductModel.id).where(ProductModel.shop_id == SHOP_ID))).all()
    ids = {n: str(i) for n, i in rows}
    for fid, dur, caption, tags, names in R:
        if caption in have:
            print("SKIP", fid)
            continue
        try:
            async with AsyncSessionFactory() as s:
                res = await ReelsService(s).upload_video(
                    shop_id=SHOP_ID,
                    video_bytes=(DIR / f"{fid}.mp4").read_bytes(),
                    caption=caption,
                    hashtags=tags,
                    tagged_product_ids=[ids[n] for n in names if n in ids],
                    content_type="video/mp4",
                    thumbnail_bytes=(DIR / f"t{fid}.jpg").read_bytes(),
                    duration_seconds=dur,
                )
            print("OK", fid, res.get("id"), res.get("video_url"), flush=True)
        except Exception as exc:  # noqa: BLE001
            print("FAIL", fid, type(exc).__name__, exc, file=sys.stderr, flush=True)


asyncio.run(main())
