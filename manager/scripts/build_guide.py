#!/usr/bin/env python3
"""Sinh GUIDE.md từ các file nguồn. Không sửa GUIDE.md bằng tay.
Dùng: python3 manager/scripts/build_guide.py          # sinh lại GUIDE.md
      python3 manager/scripts/build_guide.py --check  # exit 1 nếu GUIDE.md chưa cập nhật
"""
import pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
SOURCES = [
    ("Luật chung cho AI", ["CLAUDE.md"]),
    ("Skills", sorted(str(p.relative_to(ROOT)) for p in (ROOT / ".claude/skills").rglob("*.md"))),
    ("Templates", sorted(str(p.relative_to(ROOT)) for d in ("qc/templates", "automation/templates", "manager/templates") for p in (ROOT / d).glob("*.md"))),
    ("Bài học đã nâng thành rule", ["qc/lessons/INDEX.md", "automation/lessons/INDEX.md"]),
    ("Quyết định", ["manager/decisions.md"]),
]

def read(rel):
    p = ROOT / rel
    return p.read_text(encoding="utf8").rstrip() if p.exists() else "(chưa có file)"

def build():
    version = read("manager/VERSION")
    out = [
        f"<!-- FILE TỰ SINH bởi manager/scripts/build_guide.py — sửa file nguồn rồi chạy lại. Version {version} -->",
        read("manager/handbook.md"),
        "",
        f"## Phụ lục A — Nguồn hiện hành (v{version}, tự sinh)",
    ]
    for title, files in SOURCES:
        out.append(f"\n### {title}")
        for rel in files:
            out += [f"\n#### `{rel}`", "", "~~~~markdown", read(rel), "~~~~"]
    log = read("manager/CHANGELOG.md").splitlines()
    out += ["", "## Phụ lục B — Thay đổi gần đây", "", *log[:60], ""]
    return "\n".join(out)

if __name__ == "__main__":
    text = build()
    target = ROOT / "manager/GUIDE.md"
    if "--check" in sys.argv:
        old = target.read_text(encoding="utf8") if target.exists() else ""
        if old != text:
            print("GUIDE.md chưa cập nhật. Chạy: python3 manager/scripts/build_guide.py && git add manager/GUIDE.md")
            sys.exit(1)
        sys.exit(0)
    target.write_text(text, encoding="utf8")
    print(f"Đã sinh GUIDE.md ({len(text):,} ký tự)")
