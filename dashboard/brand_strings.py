# 品牌文案替换：仅替换 JSON 值里的 "Octop"，保留键名（octop* 契约）
import json, io, re

def walk_replace(obj, old, new):
    n = 0
    if isinstance(obj, dict):
        for k, v in obj.items():
            n += walk_replace(v, old, new)
    elif isinstance(obj, list):
        for v in obj:
            n += walk_replace(v, old, new)
    elif isinstance(obj, str):
        if old in obj:
            obj2 = obj.replace(old, new)
            n += obj.count(old)
            return n, obj2  # 不可变，需回写
    return n

def process(path, old, new):
    data = json.load(io.open(path, encoding='utf-8'))
    # 递归重写（dict/list 原地替换字符串值）
    def rec(o):
        cnt = 0
        if isinstance(o, dict):
            for k in list(o.keys()):
                v = o[k]
                if isinstance(v, str) and old in v:
                    cnt += v.count(old)
                    o[k] = v.replace(old, new)
                else:
                    cnt += rec(v)
        elif isinstance(o, list):
            for i, v in enumerate(o):
                if isinstance(v, str) and old in v:
                    cnt += v.count(old)
                    o[i] = v.replace(old, new)
                else:
                    cnt += rec(v)
        return cnt
    cnt = rec(data)
    io.open(path, 'w', encoding='utf-8', newline='\n').write(
        json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    print(path, 'replaced', cnt)

process('src/locales/zh.json', 'Octop', '芸豆YDwork')
process('src/locales/en.json', 'Octop', 'YDwork')
process('public/manifest.json', 'Octop', '芸豆YDwork')

# index.html 标题
s = io.open('index.html', encoding='utf-8').read()
t0 = s.count('<title>')
s2 = re.sub(r'<title>.*?</title>', '<title>芸豆YDwork</title>', s, count=1)
assert s2.count('<title>') == t0 == 1, t0
io.open('index.html', 'w', encoding='utf-8').write(s2)
print('index.html title ok')

# Sidebar alt 文案
p = 'src/layouts/Sidebar.tsx'
s = io.open(p, encoding='utf-8').read()
c = s.count('alt="Octop"')
s = s.replace('alt="Octop"', 'alt="芸豆YDwork"')
io.open(p, 'w', encoding='utf-8').write(s)
print('Sidebar alt replaced:', c)
