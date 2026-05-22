# DOCSSAM 매거진 Render 배포

## 1) 원클릭 배포 시작
- [Render Blueprint 시작](https://dashboard.render.com/blueprint/new?repo=https://github.com/docssam1/doossam-education-briefing)

## 2) 필수 환경변수
- `GEMINI_API_KEY` : 본인 Gemini API 키

## 3) 배포 후 확인 URL
- 변환기: `https://<render-service>.onrender.com/`
- 설정 확인: `https://<render-service>.onrender.com/api/settings`

## 4) API 입력 없이 쓰는 조건
- 서버 환경변수(`GEMINI_API_KEY`)가 설정되어 있으면 사용자 PC에서 키를 입력하지 않아도 됩니다.

## 5) 게시판(정적 페이지)
- 공개 게시판: `https://docssam1.github.io/doossam-education-briefing/`
- 관리자: `https://docssam1.github.io/doossam-education-briefing/admin.html`
- HTML 저장소: `https://docssam1.github.io/doossam-education-briefing/html-storage.html`
- HTML 뷰어: `https://docssam1.github.io/doossam-education-briefing/html-viewer.html?id=<fileId>`
