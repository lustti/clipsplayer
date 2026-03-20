// remove m3u8 ads
async function removeM3u8Ads(m3u8Url) {
    try {
        // 获取 m3u8 文件内容
        const response = await fetch(m3u8Url);
        if (!response.ok) {
            throw new Error(`Failed to fetch m3u8: ${response.status}`);
        }
        const url_slices = m3u8Url.split("/");
        const headUrl = url_slices.slice(0, 3).join("/");
        const headParentUrl = url_slices.slice(0, -1).join("/") + "/";
        const m3u8Lines = (await response.text()).split('\n');
        let hlsM3u8Url = headUrl;
        for (let i = 0; i < m3u8Lines.length; i++) {
            const line = m3u8Lines[i].trim();
            if (!line.startsWith('#')) {
                if (!line.startsWith('/')) hlsM3u8Url = headParentUrl;
                hlsM3u8Url = hlsM3u8Url + line;
                console.log("hls m3u8 url:", hlsM3u8Url);
                break;
            }
        }

        if (hlsM3u8Url === headUrl) {
            throw new Error(`Failed to find hls m3u8 url: ${line}`);
        }

        // 获取 hls m3u8 文件内容
        const hlsM3u8Response = await fetch(hlsM3u8Url);
        if (!hlsM3u8Response.ok) {
            throw new Error(`Failed to fetch hls m3u8: ${hlsM3u8Response.status}`);
        }
        const hls_m3u8Content = await hlsM3u8Response.text();

        // 解析并过滤 hls m3u8 内容
        const hlsM3u8Lines = hls_m3u8Content.split('\n');
        // 初始化核心数据结构
        const hlsPlaylist = {
            headLines: [],
            playlists: [],
            tailLines: ["#EXT-X-ENDLIST"] // end of playlist
        };

        let playlist = {
            lines: [],
            duration: 0,
            linePrefix: ""
        };

        const linePrefixCount = {};

        // 遍历每一行 M3U8 内容
        for (let index = 0; index < hlsM3u8Lines.length; index++) {
            let line = hlsM3u8Lines[index];
            line = line.trim(); // 移除首尾空白字符

            if (line.startsWith("#")) {
                if (line.startsWith("#EXT-X-DISCONTINUITY") || line.startsWith("#EXT-X-ENDLIST")) {
                    // 遇到分片分隔符，保存当前 playlist 并重置
                    if (playlist.lines.length > 0) {
                        // 深拷贝 playlist 避免引用问题（Python 的 copy() 对应）
                        hlsPlaylist.playlists.push(JSON.parse(JSON.stringify(playlist)));
                    }
                    playlist = {
                        lines: [],
                        duration: 0,
                        linePrefix: ""
                    };
                } else if (line.startsWith("#EXT-X-KEY:")) {
                    // 处理密钥行，替换 URI 前缀
                    let modify_line = line
                    if (line.includes("URI=\"")) {
                        modify_line = line.replace('URI=\"/', `URI="${headUrl}/`);
                    } else if (line.startsWith("http://") || line.startsWith("https://")) {
                        modify_line = line;
                    } else {
                        modify_line = headParentUrl + line;
                    }
                    playlist = {
                        lines: [modify_line],
                        duration: 0,
                        linePrefix: ""
                    };
                } else if (line.startsWith("#EXTINF:")) {
                    // 提取时长并累加
                    const colonIndex = line.indexOf(":");
                    const commaIndex = line.indexOf(",");
                    const duration = parseFloat(line.substring(colonIndex + 1, commaIndex));
                    playlist.lines.push(line);
                    playlist.duration += duration;
                } else if (line === "#EXT-X-ENDLIST") {
                    // 跳过结束标记（最后统一添加）
                    continue;
                } else {
                    // 其他头部标记行加入 headLines
                    hlsPlaylist.headLines.push(line);
                }
                continue; // 跳过后续逻辑，处理下一行
            }
            else if (line.startsWith("/")) {
                // 更新本地链接为完整 URL
                hlsM3u8Lines[index] = headUrl + line;
            } else if (line.startsWith("http://") || line.startsWith("https://")) {
                hlsM3u8Lines[index] = line;
            }
            else {
                hlsM3u8Lines[index] = headParentUrl + line;
            }

            // 将当前行加入 playlist
            playlist.lines.push(hlsM3u8Lines[index]);

            // 提取行前缀（第三个 / 之前的部分）
            let firstSlash = line.indexOf("/");
            let secondSlash = line.indexOf("/", firstSlash + 1);
            let thirdSlash = line.indexOf("/", secondSlash + 1);
            const linePrefix = line.substring(0, thirdSlash + 1);
            playlist.linePrefix = linePrefix;

            // 统计前缀出现次数
            if (!linePrefixCount[linePrefix]) {
                linePrefixCount[linePrefix] = 0;
            }
            linePrefixCount[linePrefix]++;
        }

        console.log("playlists count:", Object.keys(linePrefixCount).length);

        // 检查是否有有效前缀统计
        if (Object.keys(linePrefixCount).length === 0) {
            statusVar.set("未找到有效的播放列表");
            return null;
        }

        // 找到出现次数最多的前缀（模拟 Python max 函数）
        let maxKey = "";
        let maxCount = 0;
        for (const key in linePrefixCount) {
            if (linePrefixCount[key] > maxCount) {
                maxCount = linePrefixCount[key];
                maxKey = key;
            }
        }

        console.log("maxKey:", maxKey);
        // 构建无广告的播放列表
        let hlsNoadsLines = [...hlsPlaylist.headLines]; // 浅拷贝头部行

        // 筛选出前缀匹配的 playlist 行
        hlsPlaylist.playlists.forEach(playlistItem => {
            if (playlistItem.linePrefix === maxKey) {
                hlsNoadsLines = hlsNoadsLines.concat(playlistItem.lines);
            }
        });

        // 添加尾部结束标记
        hlsNoadsLines = hlsNoadsLines.concat(hlsPlaylist.tailLines);

        // 重新构建 m3u8 内容
        const filteredContent = hlsNoadsLines.join('\n');
        return filteredContent;
    } catch (error) {
        console.error('Error processing m3u8:', error);
        return m3u8Url; // 出错时返回原始 URL
    }
}

