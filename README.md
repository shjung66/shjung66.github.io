# Professor / Lab Homepage Starter

교수 개인 홈페이지와 대학원 랩 홈페이지 사이의 형태로 사용할 수 있는 정적 홈페이지 템플릿입니다.
HTML, CSS, JavaScript만 사용하므로 별도 빌드 과정 없이 GitHub Pages, Cloudflare Pages, Vercel 등에 올릴 수 있습니다.

## 파일 구조

```text
lab-homepage-starter/
├── index.html
├── profile.html
├── research.html
├── people.html
├── publications.html
├── projects.html
├── teaching.html
├── contact.html
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   └── img/
├── CODEX_PROMPT.md
└── README.md
```

## 먼저 바꿀 곳

아래 문구를 검색해서 실제 정보로 바꾸면 됩니다.

- `Your Name`
- `Professor / Principal Investigator`
- `Department of ○○○○`
- `○○ University`
- `your.email@example.com`
- `Research Area 1`
- `Student Name`
- `Project Title`

## 사진 넣는 법

1. `assets/img/` 폴더에 사진 파일을 넣습니다.
2. 예: `assets/img/profile.jpg`
3. HTML에서 아래 부분을 찾습니다.

```html
<div class="portrait placeholder" aria-label="프로필 사진 자리">
  <span>Photo</span>
</div>
```

4. 아래처럼 바꿉니다.

```html
<img class="portrait" src="assets/img/profile.jpg" alt="Your Name profile photo" />
```

학생 사진도 같은 방식으로 `person-photo` 영역을 `img` 태그로 바꾸면 됩니다.

## GitHub Pages에 올리는 기본 방법

1. GitHub에서 새 저장소를 만듭니다.
2. 이 폴더 안의 파일을 저장소에 업로드합니다.
3. 저장소 Settings → Pages에서 배포 소스를 선택합니다.
4. GitHub Pages 주소가 생성되면 접속해서 확인합니다.

## 수정 방식

처음에는 Codex에게 아래처럼 요청하면 됩니다.

> 이 저장소는 교수/랩 홈페이지용 정적 HTML 사이트입니다. README.md와 CODEX_PROMPT.md를 읽고, 실제 프로필과 연구 분야 정보를 반영해 홈페이지 문구를 수정해 주세요. 홍보성 표현은 피하고, 일반적인 교수/랩 홈페이지 톤으로 유지해 주세요.

## 권장 운영 방식

- 구성원 정보는 공개 동의를 받은 내용만 올립니다.
- 졸업생의 현재 소속은 본인이 동의한 경우에만 공개합니다.
- 논문 목록은 최신 항목이 위로 오도록 정리합니다.
- 프로젝트명 공개가 어려우면 분야 중심으로 적습니다.
