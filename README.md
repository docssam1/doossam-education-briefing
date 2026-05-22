# DOCSSAM의 교육 브리핑

GitHub Pages에서 볼 수 있는 인스타그램형 교육 칼럼/브리핑 게시판입니다.
데이터와 HTML 파일은 Google Apps Script를 통해 Google Sheet와 Google Drive에 저장합니다.

## 화면

- `index.html`: 외부 방문자가 보는 공개 게시판
- `admin.html`: 관리자 게시글 등록, 게시글 삭제
- `html-storage.html`: 생성된 HTML 코드 Google Drive 저장, 저장 목록 보기, HTML 삭제
- `html-viewer.html`: Drive에 저장된 HTML 파일을 GitHub 페이지 안에서 보기
- `STRUCTURE.md`: 전체 구조도

## 백엔드

- `apps-script/Code.gs`: Google Apps Script 백엔드
- Google Sheet `posts`: 게시판 글 저장
- Google Sheet `html_files`: Drive HTML 파일 목록 저장
- Google Drive Folder: 실제 `.html` 파일 저장

## 사용 순서

1. Google Apps Script 새 프로젝트를 만듭니다.
2. `apps-script/Code.gs` 내용을 붙여넣습니다.
3. Apps Script 편집기에서 `setup()`을 한 번 실행합니다.
4. 프로젝트 설정 > 스크립트 속성에서 `BOARD_WRITE_TOKEN`을 설정합니다.
5. 배포 > 새 배포 > 웹 앱으로 배포합니다.
6. 발급된 `/exec` URL을 `index.html`, `admin.html`, `html-storage.html`, `html-viewer.html`의 `APPS_SCRIPT_URL`에 넣거나, 관리자 화면의 Apps Script URL 입력칸에 한 번 입력합니다.
7. GitHub Pages 주소로 접속합니다.

## 권장 운영 흐름

1. GFIELD 매거진 생성기에서 HTML 콘텐츠를 만듭니다.
2. `html-storage.html`에 제목, 요약, HTML 코드를 붙여넣고 저장합니다.
3. `저장 후 게시판에도 공개`를 켜면 `index.html` 공개 게시판 카드에도 같이 등록됩니다.
4. 직접 짧은 글만 올릴 때는 `admin.html`에서 게시글을 등록합니다.
5. 독자는 `index.html`에서 `이전 칼럼 보기` 또는 `저장된 HTML 열기`로 칼럼을 봅니다.
6. 삭제는 `admin.html` 또는 `html-storage.html`에서 합니다.
7. Drive 파일을 공개 공유하지 않아도 `html-viewer.html`이 Apps Script를 통해 내용을 불러옵니다.

## 보안

- Google Sheet ID, Drive Folder ID, 등록 토큰은 Apps Script Properties에 저장합니다.
- 등록 토큰은 GitHub 코드에 넣지 말고, 페이지의 관리자 토큰 입력칸에만 넣어 사용하세요.
- 토큰이 없는 상태로 공개하면 누구나 글을 등록할 수 있습니다.

## Node 서버 배포 (Apps Script 없이)

`localhost:8787`에서 쓰던 GFIELD 매거진 변환 서버를 그대로 배포할 수 있습니다.

- 서버 코드 위치: `personal-gemini-proxy/`
- 소스 HTML: `gfield-magazine-patched.html`
- 배포 설정: `render.yaml`

Render 기준:

1. `docssam1/doossam-education-briefing` 저장소를 Render에 연결합니다.
2. Blueprint 배포를 선택하면 `render.yaml`이 자동 인식됩니다.
3. 환경변수 `GEMINI_API_KEY` 값을 설정합니다.
4. 배포 후 발급 URL로 접속합니다.

이 경로는 Apps Script를 사용하지 않고 Node 서버가 직접 `/api/generate`를 처리합니다.
