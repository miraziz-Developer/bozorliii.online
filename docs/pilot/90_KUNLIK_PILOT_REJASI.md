# Bozorliii — 90 kunlik Ippodrom piloti

## 1. Pilot chegarasi

- **Bozor:** Ippodrom, Toshkent.
- **Kategoriya:** ayollar kiyimi.
- **Model:** katalog → bron → Telegram/CRM tasdiq → do'konda naqd yoki terminal → QR pickup.
- **Pilotda yo'q:** online checkout, escrow, avtomatik payout, Xitoy katalogi va yetkazib berish va'dasi.
- **Pilot muddati:** production ishga tushgan kundan 90 kun.
- **Taklif:** sotuvchiga 90 kun bepul; keyingi pullik xizmat faqat alohida rozilik bilan.

Bu tanlov — boshlang'ich ishchi gipoteza. 1–14-kundagi intervyular kuchli qarshi dalil bersa, faqat yozma qaror bilan kategoriya o'zgartiriladi.

## 2. Rollar

| Rol | Minimal yuklama | Javobgarlik |
|---|---:|---|
| Pilot rahbari | 1 kishi, to'liq vaqt | KPI, haftalik qaror, bozor hamkorligi |
| Merchant operator | 2 kishi | Do'kon topish, onboarding, qoldiq nazorati |
| Kontent operator | 1 kishi | Foto, nom, narx, razmer/rang, moderatsiya |
| Texnik navbatchi | 0.5–1 stavka | Uptime, xato, deploy, analitika |
| Support | Operatorlar bilan birlashtiriladi | Mijoz va sotuvchi savollari |

Bir kishi bir nechta rolni bajarishi mumkin, ammo har bir rolga ism va telefon `KICKOFF_CHECKLIST.md`da yozilmaguncha reklama boshlanmaydi.

## 3. Bosqichlar

### 1–14-kun: muammoni tasdiqlash

1. Ippodromdagi kamida 30 ayollar kiyimi do'koni bilan suhbat.
2. Kamida 20 ta to'liq intervyuni `interview-tracker.csv`ga yozish.
3. Savollar: qoldiq qanchalik tez o'zgaradi, bron hozir qanday olinadi, javob vaqti, bekor bron sababi, reklama xarajati, qanday natija uchun pul to'lashi.
4. Kamida 10 do'kondan pilotga og'zaki rozilik olish.

**Gate A:** 20 intervyudan kamida 8 tasi bron/mijoz topish muammosini muhim desa va kamida 10 tasi pilotga kirsa — davom etish. Aks holda taklif yoki kategoriya qayta ko'riladi.

### 15–30-kun: supply tayyorlash

1. 15–20 do'konni ro'yxatdan o'tkazish va moderator tasdig'idan o'tkazish.
2. Har do'konda kamida 20 ta haqiqiy mahsulot: 3+ foto, narx, razmer/rang, qoldiq, rasta joyi.
3. Har bir do'konda test bron → Telegram → CRM → tayyor → QR pickup oqimini bajarish.
4. Noto'g'ri yoki eskirgan katalogni reklama qilish taqiqlanadi.

**Gate B:** kamida 15 faol do'kon, 400 faol mahsulot va test oqimlarining 90% muvaffaqiyatli bo'lsa trafik boshlanadi.

### 31–60-kun: boshqariladigan trafik

1. QR kartalarni rastalarda joylashtirish; faqat UTM/ref token bilan kampaniya yuritish.
2. Kunlik bron, tasdiqlash vaqti, bekor qilish va QR yakunlashni kuzatish.
3. Javobsiz bron 15 daqiqada operatorga eskalatsiya qilinadi.
4. Haftasiga bir marta narx/qoldiq auditi: tasodifiy 10% mahsulot.
5. Haftasiga 5 ta mijoz va 5 ta sotuvchi bilan qisqa follow-up.

### 61–90-kun: takroriy foydalanish va monetizatsiya testi

1. 30–50 faol do'kon va 1 000–2 000 sifatli mahsulotga chiqish.
2. Sotuvchiga natija kartasi: ko'rish → bron → QR yakunlangan savdo.
3. Kamida 20 faol sotuvchiga uchta narx gipotezasini ko'rsatish: premium vitrina, sponsor banner, oylik Pro paket.
4. Faqat “ha, shu narxda olaman” javobini willingness-to-pay deb sanash; “qiziq” javobi sanalmaydi.
5. 90-kun qarorini quyidagi mezonlar bilan yozma rasmiylashtirish.

## 4. KPI va qaror mezonlari

| KPI | 30-kun | 60-kun | 90-kun |
|---|---:|---:|---:|
| Faol do'kon | 15 | 30 | 30–50 |
| Faol real mahsulot | 400 | 1 000 | 1 000–2 000 |
| Bronlar / 30 kun | baseline | ≥100 | ≥250 |
| Sotuvchi median javobi | o'lchanadi | ≤15 daqiqa | ≤10 daqiqa |
| QR bilan yakunlash / bron | o'lchanadi | ≥20% | ≥30% |
| Bekor qilingan bron | o'lchanadi | ≤35% | ≤25% |
| 30 kun ichida qayta bron qilgan mijoz | baseline | ≥10% | ≥15% |
| Pullik xizmatni aniq tanlagan faol do'kon | so'ralmaydi | ≥5 | ≥10 yoki ≥25% |

**Davom ettirish:** 90-kunda kamida 30 faol do'kon, 1 000 mahsulot, 250 bron/30 kun, ≥30% QR completion va ≥10 pullik niyat.

**Pivot:** supply maqsadi bajarilib, bron/QR past bo'lsa kategoriya, UX yoki trafik kanali o'zgartiriladi.

**To'xtatish/sotish:** 90 kunlik intizomli ijrodan keyin ham sotuvchi faolligi, takroriy mijoz va to'lash niyati mezonlarining ko'pchiligi bajarilmasa.

## 5. Kunlik operatsion ritm

- 09:00 — kechagi KPI va ochiq incidentlar.
- 10:00–13:00 — yangi do'konlar/foto.
- 14:00 — narx va qoldiq yangilash.
- 15:00–18:00 — bron monitoringi va support.
- 18:30 — kunlik tracker, javobsiz bronlar, ertangi reja.
- Dushanba — haftalik cohort/KPI review; juma — katalog sifati auditi.

## 6. Huquqiy va moliyaviy chegara

Pilot “katalog va bron axborot xizmati” sifatida yuritiladi. Bozorliii mijoz pulini qabul qilmaydi va ushlab turmaydi. To'lov mijoz va do'kon o'rtasida do'konda amalga oshadi. Quyidagilar yurist/buxgalter tasdig'isiz yoqilmaydi:

- online payment va fiskal chek;
- escrow yoki sotuvchiga payout;
- avtomatik savdo komissiyasi;
- shaxsiy ma'lumotlardan yangi marketing maqsadida foydalanish.

Sotuvchi roziligi, platforma ofertasi, maxfiylik siyosati va ma'lumotni o'chirish jarayoni launch checklist bilan tekshiriladi. Bu hujjat yuridik maslahat o'rnini bosmaydi.