# Pilot kickoff checklist

## Launchdan oldin majburiy

- [ ] Pilot boshlanish va tugash sanasi yozildi.
- [ ] Pilot rahbari, 2 operator, kontent va texnik mas'ul tayinlandi.
- [ ] 90 kunlik jami budjet va haftalik limit tasdiqlandi.
- [ ] Ippodrom ma'muriyati bilan kirish/foto/QR material masalasi kelishildi.
- [ ] Sotuvchi pilot roziligi va maxfiylik matni yurist tomonidan tekshirildi.
- [ ] `ENABLE_ONLINE_CHECKOUT=false`.
- [ ] `NEXT_PUBLIC_ENABLE_ONLINE_CHECKOUT=false`.
- [ ] `ENABLE_CHINA_MARKET=false` va `NEXT_PUBLIC_ENABLE_CHINA_MARKET=false`.
- [ ] `NEXT_PUBLIC_PILOT_MODE=true`.
- [ ] Demo/seed ma'lumot o'chirilgan: `ALLOW_DEV_MOCKS=false`, `RUN_SEED=false`.
- [ ] Telegram merchant bot ishlaydi.
- [ ] Har do'kon uchun test bron va QR pickup bajarildi.
- [ ] Yandex Metrika va admin analytics real trafikni yozmoqda.
- [ ] Backup, uptime va incident aloqa kanali tekshirildi.

## Budjet shabloni

| Band | 90 kunlik limit (UZS) | Mas'ul | Tasdiq |
|---|---:|---|---|
| Operatorlar |  |  | [ ] |
| Foto/kontent |  |  | [ ] |
| QR/bosma material |  |  | [ ] |
| Performance reklama |  |  | [ ] |
| Server/SMS/API |  |  | [ ] |
| Huquqiy/buxgalteriya |  |  | [ ] |
| 10% rezerv |  |  | [ ] |

## Go / no-go

`bash scripts/preflight-deploy.sh .env` xatosiz tugamaguncha va yuqoridagi majburiy bandlar odam tomonidan yopilmaguncha pullik trafik yuborilmaydi.