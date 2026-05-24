const ADMIN_FOLDER_ID = '1XZ5mKpzTZfG1yTmlscH4dBTS4E2NzVSb';
const VIEW_FOLDER_ID = '1yhFg98edwY2IOMa7-7o2ZTN54CksBlqK';
const DEFAULT_TOKEN = 'gfield7772';

function doGet(e) {
  const action = (e.parameter.action || '').trim();
  if (action === 'listPosts') return json_(listPosts_(), e);
  return json_({ ok: true, service: 'GFIELD Magazine Publisher' }, e);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const action = data.action || 'publishPost';
    const token = data.token || '';
    const savedToken = PropertiesService.getScriptProperties().getProperty('MAGAZINE_WRITE_TOKEN') || DEFAULT_TOKEN;
    if (!token || token !== savedToken) throw new Error('Invalid token');
    if (action === 'publishPost') return json_(publishPost_(data));
    if (action === 'deletePost') return json_(deletePost_(data.id));
    throw new Error('Unknown action');
  } catch (err) {
    return json_({ ok: false, error: err.message });
  }
}

function publishPost_(data) {
  const adminFolder = DriveApp.getFolderById(ADMIN_FOLDER_ID);
  const viewFolder = DriveApp.getFolderById(VIEW_FOLDER_ID);
  const post = {
    id: data.id || Utilities.getUuid(),
    title: data.title || '교육 인사이트 브리핑',
    category: data.category || '교육정책',
    tone: data.tone || '인사이트형',
    summary: data.summary || '',
    sourceUrl: data.sourceUrl || '',
    imageUrl: data.imageUrl || '',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isNew: data.isNew !== false
  };
  const safeName = sanitize_(post.createdAt.slice(0, 10) + '-' + post.title);
  const html = data.html || '';
  if (!html) throw new Error('HTML content is required');

  const adminFile = adminFolder.createFile(safeName + '.html', html, MimeType.HTML);
  const viewFile = viewFolder.createFile(safeName + '.html', html, MimeType.HTML);
  viewFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  post.adminFileId = adminFile.getId();
  post.htmlFileId = viewFile.getId();
  post.htmlViewUrl = viewFile.getUrl();

  const posts = listPosts_().posts || [];
  posts.unshift(post);
  savePosts_(posts);
  return { ok: true, post: post, posts: posts };
}

function deletePost_(id) {
  if (!id) throw new Error('id is required');
  const posts = (listPosts_().posts || []).filter(p => p.id !== id);
  savePosts_(posts);
  return { ok: true, posts: posts };
}

function listPosts_() {
  const viewFolder = DriveApp.getFolderById(VIEW_FOLDER_ID);
  let file = findFile_(viewFolder, 'posts.json');
  if (!file) return { ok: true, posts: [] };
  const text = file.getBlob().getDataAsString('UTF-8');
  try {
    return { ok: true, posts: JSON.parse(text || '[]') };
  } catch (err) {
    return { ok: true, posts: [] };
  }
}

function savePosts_(posts) {
  const viewFolder = DriveApp.getFolderById(VIEW_FOLDER_ID);
  const text = JSON.stringify(posts, null, 2);
  let old = findFile_(viewFolder, 'posts.json');
  if (old) old.setTrashed(true);
  const file = viewFolder.createFile('posts.json', text, MimeType.PLAIN_TEXT);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file;
}

function findFile_(folder, name) {
  const files = folder.getFilesByName(name);
  return files.hasNext() ? files.next() : null;
}

function sanitize_(s) {
  return String(s || '').replace(/[\\/:*?"<>|#%{}^~[\]`]/g, '-').replace(/\s+/g, '-').slice(0, 90);
}

function json_(obj, e) {
  const callback = e && e.parameter && e.parameter.callback;
  const text = callback ? callback + '(' + JSON.stringify(obj) + ')' : JSON.stringify(obj);
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.JAVASCRIPT);
}
