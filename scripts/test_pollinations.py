import urllib.request
import urllib.error

url = 'https://image.pollinations.ai/prompt/a%20cute%20kawaii%20cat?width=512&height=512&nologo=true'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    res = urllib.request.urlopen(req)
    print("SUCCESS:", res.getcode())
except urllib.error.HTTPError as e:
    print("FAILED:", e.code)
    try:
        print(e.read()[:200])
    except:
        pass
