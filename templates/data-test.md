| No. | Item | Test content | Test Data | Remarks |
|---|---|---|---|---|
| D01 | Blank | Bỏ trống field bắt buộc | (trống) | |
| D02 | White space | Space đầu/cuối phải được trim | "  abc  " | |
| D03 | Hiragana | | ひらがな | |
| D04 | Katakana full-width | | カタカナ | |
| D05 | Katakana half-width | | ｶﾀｶﾅ | |
| D06 | Kanji | | 漢字 | |
| D07 | Romaji full-width | | Ｍａｎｇａ | |
| D08 | Số full-width | | ０１２３ | |
| D09 | JP sign | | ，．。「」（）【】・ | |
| D10 | Emoji / symbol number | | 🙇‍♀️ ① ② | |
| D11 | SQL injection | Không trả về DB | SELECT * FROM Users WHERE UserId=105 OR 1=1; | |
| D12 | Max length | max / max+1 | 255 / 256 ký tự | 1 break line = 1 char |
| D13 | Date | Năm nhuận / không nhuận / sai format | 2020/02/29 · 2022/02/29 · 2022-20-20 | |
| D14 | int32 | min / max | -2147483648 / 2147483647 | |