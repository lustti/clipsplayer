#!/bin/bash

# ====================== 配置项（请根据实际情况修改）======================
LOCAL_FOLDER="."  # 本地要上传的文件夹路径
REMOTE_USER="luckti"               # 服务器用户名（如 root）
REMOTE_HOST="local.server"              # 服务器IP（如 192.168.1.101）
REMOTE_FOLDER="/home/luckti/sites/clipsplayer"    # 服务器目标文件夹路径
# =======================================================================

# 校验本地文件夹是否存在
if [ ! -d "$LOCAL_FOLDER" ]; then
    echo "错误：本地文件夹 $LOCAL_FOLDER 不存在！"
    exit 1
fi

# 核心命令：用 rsync 传输，排除 . 开头的子文件夹
# -a：归档模式（保留权限、递归等）
# -v：详细输出（可删除，静默传输）
# --dry-run：模拟传输，不实际上传（可删除，仅用于测试）
# --exclude='*/.*'：排除所有子目录下 . 开头的文件夹（如 ./dir/.hidden、./.hidden 等）
# --include='*.mp4'：只传输 .mp4 文件
# --delete：可选，删除远程文件夹中本地不存在的文件（保持同步，不需要可删除）
# rsync -av --dry-run \
rsync -av --delete \
    --exclude='.*' \
    --exclude='*/.*' \
    --exclude='assets/data/' \
    --include='*/' \
    --include='*.html' \
    --include='*.jpg' \
    --include='*.png' \
    --include='*.webp' \
    --include='*.gif' \
    --include='*.mp4' \
    --include='*.m3u8' \
    --include='*.json' \
    --include='*.js' \
    --include='*.css' \
    --include='*.ttf' \
    --include='*.woff2' \
    --include='*.cur' \
    --include='.htaccess' \
    --exclude='*' \
    "$LOCAL_FOLDER/" \
    "$REMOTE_USER@$REMOTE_HOST:$REMOTE_FOLDER/"


# 检查传输是否成功
if [ $? -eq 0 ]; then
    echo "✅ 文件上传成功！"
    echo "本地路径：$(realpath $LOCAL_FOLDER)"
    echo "远程路径：$REMOTE_USER@$REMOTE_HOST:$REMOTE_FOLDER"
else
    echo "❌ 文件上传失败！"
    exit 1
fi