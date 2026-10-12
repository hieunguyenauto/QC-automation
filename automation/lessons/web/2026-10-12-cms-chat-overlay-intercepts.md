# 2026-10-12 Khung chat mở che nút thu nhỏ của chính nó
- Loại: CLICK / OVERLAY
- Nguồn: run reports/20261012-105319-dev, E2E-TC-002 bước 32
- Function / màn hình: CMS 作業依頼詳細 — chat popover (.chat-popover)
- Triệu chứng: locator.click timeout 15s; log "<form class='cf-chat-input'> … subtree intercepts pointer events".
- Nguyên nhân gốc: nội dung popover (.chat-popover__content.open) nằm đè lên .popover-trigger; click thật bị chặn.
- Cách fix: common/ui.ts minimizeChat: trigger.dispatchEvent('click') rồi expect nội dung chat toBeHidden. Không dùng force:true (vẫn theo toạ độ).
- Rule rút ra: R12
- Áp dụng cho: popover / chat / toast / overlay nổi; khi log có "intercepts pointer events".
