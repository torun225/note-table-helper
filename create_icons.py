#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont

def create_icon(size):
    # 背景色
    bg_color = (74, 144, 226)  # #4A90E2
    fg_color = (255, 255, 255)  # white

    # 画像を作成
    img = Image.new('RGB', (size, size), bg_color)
    draw = ImageDraw.Draw(img)

    # マージンを計算
    margin = size // 10
    table_size = size - 2 * margin

    # 表のグリッドを描画
    line_width = max(2, size // 32)

    # 外枠
    draw.rectangle(
        [margin, margin, size - margin, size - margin],
        outline=fg_color,
        width=line_width
    )

    # 横線（3行に分割）
    row_height = table_size // 3
    for i in range(1, 3):
        y = margin + row_height * i
        draw.line(
            [margin, y, size - margin, y],
            fill=fg_color,
            width=line_width
        )

    # 縦線（3列に分割）
    col_width = table_size // 3
    for i in range(1, 3):
        x = margin + col_width * i
        draw.line(
            [x, margin, x, size - margin],
            fill=fg_color,
            width=line_width
        )

    return img

# 48x48と96x96のアイコンを作成
icon_48 = create_icon(48)
icon_48.save('/home/ope/project/note-table-helper/icons/icon-48.png')

icon_96 = create_icon(96)
icon_96.save('/home/ope/project/note-table-helper/icons/icon-96.png')

# Chrome用に128x128も作成
icon_128 = create_icon(128)
icon_128.save('/home/ope/project/note-table-helper/icons/icon-128.png')

print("アイコンを作成しました:")
print("- icons/icon-48.png")
print("- icons/icon-96.png")
print("- icons/icon-128.png")
