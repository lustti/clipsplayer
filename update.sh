#!/bin/bash
# update from gitlab
git pull
set -x
# 确保目标目录存在
root_dir=../home/clipsplayer
mkdirs -p $root_dir

# find all html to copy
html_files=$(find . -type f -name "*.html")
for html_file in $html_files; do
    # 计算相对路径
    relative_path="${html_file#.}"
    target_file="$root_dir$relative_path"
    # 创建目标文件的父目录
    target_dir=$(dirname "$target_file")
    sudo mkdir -p "$target_dir"
    # 复制文件
    sudo cp -f "$html_file" "$target_file"
done

# cp -rf ./_data ../home/

# 复制 assets 目录
sudo cp -rf ./assets $root_dir
set +x