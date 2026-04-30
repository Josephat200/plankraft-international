import http.server
import os
import gzip
import io
import mimetypes
import socketserver
from functools import partial

PORT = 5000
HOST = "0.0.0.0"
DIRECTORY = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")

COMPRESSIBLE = {
    "text/html", "text/css", "text/javascript",
    "application/javascript", "application/json",
    "image/svg+xml", "text/plain"
}

CACHE_CONTROL = {
    ".jpg": "public, max-age=2592000",
    ".jpeg": "public, max-age=2592000",
    ".png": "public, max-age=2592000",
    ".gif": "public, max-age=2592000",
    ".webp": "public, max-age=2592000",
    ".svg": "public, max-age=86400",
    ".css": "public, max-age=86400",
    ".js": "public, max-age=86400",
    ".html": "no-store, no-cache, must-revalidate",
    ".ico": "public, max-age=604800",
}


class FastHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        path = self.path.split("?")[0]
        ext = os.path.splitext(path)[1].lower()
        cc = CACHE_CONTROL.get(ext, "no-store, no-cache, must-revalidate")
        self.send_header("Cache-Control", cc)
        if ext not in (".html", ""):
            pass
        else:
            self.send_header("Pragma", "no-cache")
        self.send_header("Vary", "Accept-Encoding")
        super().end_headers()

    def send_response_only(self, code, message=None):
        super().send_response_only(code, message)

    def do_GET(self):
        path = self.translate_path(self.path)
        if os.path.isfile(path):
            mime, _ = mimetypes.guess_type(path)
            if mime in COMPRESSIBLE:
                accept = self.headers.get("Accept-Encoding", "")
                if "gzip" in accept:
                    with open(path, "rb") as f:
                        data = f.read()
                    buf = io.BytesIO()
                    with gzip.GzipFile(fileobj=buf, mode="wb", compresslevel=6) as gz:
                        gz.write(data)
                    compressed = buf.getvalue()
                    self.send_response(200)
                    self.send_header("Content-Type", mime)
                    self.send_header("Content-Encoding", "gzip")
                    self.send_header("Content-Length", str(len(compressed)))
                    self.end_headers()
                    self.wfile.write(compressed)
                    return
        super().do_GET()

    def log_message(self, format, *args):
        pass


def main():
    handler = partial(FastHandler, directory=DIRECTORY)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer((HOST, PORT), handler) as httpd:
        print(f"Serving {DIRECTORY} at http://{HOST}:{PORT}")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
