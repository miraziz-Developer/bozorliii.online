"""Additive demo-catalog seeder: adds realistic products to ONE existing shop.

Run inside the backend container (never deletes anything):
  docker cp seed_imgs <ctr>:/tmp/seed_imgs
  docker exec -i <ctr> env PYTHONPATH=/app python - < scripts/seed_shop_catalog.py
Idempotent by product name: existing names in the shop are skipped.
"""
from __future__ import annotations

import asyncio
import sys
from pathlib import Path
from uuid import UUID

from sqlalchemy import select

from app.application.merchant.catalog_product_service import MerchantCatalogProductService
from app.application.merchant.schemas import ProductVariantCatalogInput, ProductVariantColorInput
from app.infrastructure.db.models import ProductModel
from app.infrastructure.db.session import AsyncSessionFactory

SHOP_ID = UUID("f1b8ba42-0dfd-420c-9ada-3b171ea85ed2")
IMG_DIR = Path("/tmp/seed_imgs")
CL = ["S", "M", "L", "XL"]
ONE = ["Standart"]
KIDS = ["4-5 yosh", "6-7 yosh", "8-9 yosh"]

# (image, name, price UZS, description, colors, sizes, stock per SKU, featured)
P = [
    ("u02", "Yirtiq jinsi shim (ayollar)", 189000, "Zamonaviy yirtiq uslubdagi ayollar jinsi shimi. Yumshoq denim, qulay kesim.", ["Ko'k"], CL, 6, True),
    ("u03", "Charm kurtka (erkaklar)", 690000, "Sifatli sun'iy charmdan tikilgan qora kurtka. Bahor va kuz uchun.", ["Qora"], CL, 4, True),
    ("u04", "Tuya rangli palto", 780000, "Klassik uzun palto, issiq va yengil mato. Ofis va shahar uchun.", ["Tuya"], CL, 3, True),
    ("u05", "Oq futbolka (oversize)", 79000, "100% paxta, oversize kesim. Kundalik kiyim uchun.", ["Oq"], CL, 12, False),
    ("u06", "Yashil futbolka to'plami", 99000, "Paxtali futbolkalar, yumshoq va nafas oladigan mato.", ["Yashil"], CL, 10, False),
    ("u08", "Qora futbolka, kichik logotip", 89000, "Qora klassik futbolka, ko'krakda kichik naqsh.", ["Qora"], CL, 12, False),
    ("u12", "To'q ko'k ryukzak", 210000, "Sig'imli shahar ryukzagi, noutbuk uchun bo'limi bor.", ["To'q ko'k"], ONE, 8, False),
    ("u14", "To'qilgan savat sumka", 165000, "Qo'lda to'qilgan yozgi sumka, yorqin rang.", ["To'q sariq"], ONE, 7, True),
    ("u15", "Ayollar bluzkalari", 145000, "Yengil bluzka, yozgi mato, turli o'lchamlar mavjud.", ["Bej", "Oq"], CL, 5, False),
    ("u16", "Sariq sport kostyum", 320000, "Yumshoq trikotaj sport kostyum: ustki kiyim va shim.", ["Sariq"], CL, 6, True),
    ("u18", "Bordo palto (ayollar)", 850000, "Chiroyli bordo rangli ayollar paltosi, issiq astar bilan.", ["Bordo"], CL, 3, True),
    ("u19", "Havorang ko'ylak", 175000, "Klassik erkaklar ko'ylagi, paxtali mato.", ["Havorang"], CL, 8, False),
    ("u20", "Kulrang klassik shim", 230000, "Klassik kesimdagi erkaklar shimi, ofis uchun.", ["Kulrang"], ["46", "48", "50", "52"], 6, False),
    ("u23", "Naqshli qora futbolka (erkaklar)", 95000, "Zamonaviy printli qora futbolka, sifatli paxta.", ["Qora"], CL, 10, False),
    ("p14829326", "Qizil kapyushonli kurtka", 420000, "Issiq qizil kurtka, kapyushon bilan. Sovuq kunlar uchun.", ["Qizil"], CL, 5, True),
    ("p5319517", "Qora xudi", 260000, "Qora kapyushonli xudi, ichi momiq.", ["Qora"], CL, 9, True),
    ("p10971114", "Kulrang xudi", 250000, "Kulrang xudi, keng cho'ntak va yumshoq mato.", ["Kulrang"], CL, 9, False),
    ("p8974541", "Qishki kurtka, beanie shapka bilan", 560000, "Issiq qishki kurtka va beanie shapka.", ["Qora"], CL, 4, False),
    ("p7026775", "Pufak kurtka (puffer)", 640000, "Yengil va juda issiq puffer kurtka.", ["Qora", "Bej"], CL, 4, True),
    ("p1792828", "To'qilgan kardigan (ayollar)", 220000, "Yumshoq to'qilgan kardigan, bahor va kuz uchun.", ["Bej"], CL, 6, False),
    ("p5710046", "Trikotaj sviterlar", 195000, "Issiq trikotaj sviter, sifatli ip.", ["Kulrang", "Bej"], CL, 7, False),
    ("p18629055", "Erkaklar shapka va sharf to'plami", 130000, "Qishki shapka va sharf to'plami, yumshoq va issiq.", ["Qora"], ONE, 10, False),
    ("p5792943", "Bolalar qizil kurtkasi", 340000, "Bolalar uchun issiq qizil kurtka, yengil va qulay.", ["Qizil"], KIDS, 5, True),
    ("p18039502", "Qizlar sariq yubka (tul)", 150000, "Qizlar uchun chiroyli sariq tul yubka, bayram uchun.", ["Sariq"], KIDS, 6, False),
    ("p17984670", "Oq bluzka va kulrang yubka", 310000, "Ofis uslubidagi oq bluzka va kulrang yubka to'plami.", ["Oq/Kulrang"], CL, 5, False),
    ("p10512915", "Atlas pushti bluzka", 185000, "Nozik atlas mato, nafis pushti rang.", ["Pushti"], CL, 6, False),
    ("p7173000", "Qizil bluzka va qora yubka", 290000, "Qizil bluzka va qora yubka, nafis kundalik uslub.", ["Qizil/Qora"], CL, 5, False),
    ("p4061519", "Ko'k blazer va kulrang shim", 620000, "Ofis uchun klassik kostyum: ko'k blazer va kulrang shim.", ["Ko'k/Kulrang"], CL, 4, True),
    ("p450212", "To'q ko'k blazer, oq ko'ylak bilan", 590000, "Zamonaviy to'q ko'k blazer va oq ko'ylak.", ["To'q ko'k"], CL, 4, False),
    ("p298863", "Charm poyabzal (erkaklar)", 480000, "Jigarrang klassik erkaklar poyabzali.", ["Jigarrang"], ["40", "41", "42", "43", "44"], 4, True),
]


def _norm(s: str) -> str:
    return " ".join(s.strip().lower().split())


async def main() -> None:
    created = skipped = failed = 0
    async with AsyncSessionFactory() as s:
        existing = set((await s.execute(select(ProductModel.name).where(ProductModel.shop_id == SHOP_ID))).scalars().all())
    for key, name, price, desc, colors, sizes, per_sku, featured in P:
        if name in existing:
            skipped += 1
            continue
        try:
            data = (IMG_DIR / f"{key}.jpg").read_bytes()
            catalog = ProductVariantCatalogInput(
                all_sizes=sizes,
                colors=[ProductVariantColorInput(name=c, sizes=sizes, image_urls=[]) for c in colors],
                sku_stock={f"{_norm(c)}|{_norm(sz)}": per_sku for c in colors for sz in sizes},
                fallback_stock=0,
            )
            async with AsyncSessionFactory() as s:
                svc = MerchantCatalogProductService(s)
                res = await svc.create_product(
                    SHOP_ID, name=name, price=price, description=desc,
                    stock_count=per_sku * len(sizes) * len(colors), is_featured=featured,
                    image_bytes=data, content_type="image/jpeg", variant_catalog=catalog,
                )
                await s.commit()
            created += 1
            print("OK", name, res.get("id"), flush=True)
        except Exception as exc:  # noqa: BLE001
            failed += 1
            print("FAIL", name, type(exc).__name__, exc, file=sys.stderr, flush=True)
    print(f"created={created} skipped={skipped} failed={failed}")


asyncio.run(main())
