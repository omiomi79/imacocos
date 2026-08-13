// 画面表示の翻訳。Xへ渡す投稿本文は会場に合わせて日本語のままなので、ここには含めない。
// ブランド表記（CoCoS / POST / FIND など）と記号は共通なので翻訳対象から外している。

export const LANGUAGES = [
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ko', label: '한국어' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

const ja = {
  'tab.post': '投稿するモード',
  'tab.find': '探すモード',

  'common.optional': '任意',

  'post.title': 'いま、ここっす！！',
  'post.intro': '場所と状態を選ぶだけ。投稿前に内容を確認できます。',
  'post.place': '場所',
  'post.selectArea': 'エリアを選ぶ',
  'post.areaMeta': '{floor}／1日目 {day1}／2日目 {day2}',
  'post.areaNotice':
    '黄色の部分はあくまで想定されるエリアであり、当日の状況により異なる場合がございます。おおよその場所として指定するためにご使用ください。また東7・8エリアについては指定がしかねる点、ご了承ください。',
  'post.status': '現在の状態',
  'post.note': 'ひとこと',
  'post.xId': 'XのID',
  'post.xIdHelp':
    '入れると、リンク先のページに「@◯◯ さんの現在地」と出ます。@は付けても付けなくても大丈夫です。',
  'post.xIdError': '英数字とアンダースコアのみ、15文字までです',
  'post.length': 'Xの文字数 {count} / {max}',
  'post.lengthOver': 'Xの上限を超えています（{count} / {max}）ひとことを短くしてください',
  'post.submit': 'Xに投稿！',
  'post.submitNote': 'Xの画面で内容を確認・編集してから投稿されます。',
  'post.previewLabel': 'Xへの投稿プレビュー',

  'status.1': '撮影中',
  'status.2': '交流中',
  'status.4': '向かいます',

  'map.guideTitle': 'エリアガイド',
  'map.question': 'マップ上の場所は？',
  'map.help': 'だいたいの位置をタップしてください。',
  'map.selected': '選択中: {cell}',
  'map.notSelected': '場所を選択してください',
  'map.cellLabel': '場所 {cell}',
  'map.guideAlt': '{area}の案内図',
  'map.mapAlt': '{area}の見取り図',
  'map.guideFallback': 'エリアの案内図です。',

  'area.east8': '東8コスプレエリア（内＋外）',
  'area.east8in': '東8コスプレエリア（内）',
  'area.antenna': '東7外アンテナサイト コスプレエリア',
  'area.garden': '庭園コスプレエリア',
  'area.rooftop': '屋上展示場コスプレエリア',
  'area.rest': '休憩中',

  'search.title': 'いま、どこっす？',
  'search.intro': '投稿された場所をXで探します。アカウントを入れると、その人だけに絞れます。',
  'search.scope': 'だれの投稿',
  'search.scopeAll': 'すべての人',
  'search.scopeFollows': 'フォロー中の人だけ',
  'search.scopeFollowsHelp': 'Xにログインしている本人のフォローが基準になります。',
  'search.account': 'アカウント',
  'search.accountHelpAll': '空のままなら、投稿した人すべてから探します。',
  'search.accountHelpFollows': '空のままなら、フォロー中の人すべてから探します。',
  'search.range': 'いつの投稿',
  'search.range1': '直近1時間',
  'search.range3': '直近3時間',
  'search.range6': '直近6時間',
  'search.rangeAny': '指定なし',
  'search.since': '{time} 以降の投稿を探します。',
  'search.submit': 'Xで探す',
  'search.note': '新しい順に表示されます。',
  'search.panelLabel': '投稿を探す',

  'footer.note1': '西4ホールはコスプレエリアではありません。',
  'footer.note2': '雨天など悪天候により、コスプレエリアの使用を制限する場合があります。',
  'footer.privacy':
    '入力内容は保存されず、Xの投稿画面へ渡されます。個人を特定できる情報や誹謗中傷は書かないでください。',

  'lang.select': 'Select Language',
  'nav.label': '画面の切り替え',
} as const;

export type MessageKey = keyof typeof ja;

const en: Record<MessageKey, string> = {
  'tab.post': 'Post mode',
  'tab.find': 'Find mode',

  'common.optional': 'optional',

  'post.title': "I'm here now!",
  'post.intro': 'Just pick a place and a status. You can review everything before posting.',
  'post.place': 'Place',
  'post.selectArea': 'Choose an area',
  'post.areaMeta': '{floor} / Day 1 {day1} / Day 2 {day2}',
  'post.areaNotice':
    'The yellow zones are approximate and may differ on the day. Please use them to indicate a rough location. Note that East 7 and 8 cannot be pinpointed.',
  'post.status': 'Current status',
  'post.note': 'Message',
  'post.xId': 'X username',
  'post.xIdHelp':
    'If you enter it, the linked page will show "@you is here". The @ is optional.',
  'post.xIdError': 'Letters, numbers and underscores only, up to 15 characters',
  'post.length': 'Length on X: {count} / {max}',
  'post.lengthOver': 'Over the limit on X ({count} / {max}). Please shorten your message.',
  'post.submit': 'Post on X',
  'post.submitNote': 'You can review and edit the text on X before posting.',
  'post.previewLabel': 'Preview of your post on X',

  'status.1': 'Shooting',
  'status.2': 'Chatting',
  'status.4': 'On my way',

  'map.guideTitle': 'Area guide',
  'map.question': 'Where on the map?',
  'map.help': 'Tap roughly where you are.',
  'map.selected': 'Selected: {cell}',
  'map.notSelected': 'Please choose a spot',
  'map.cellLabel': 'Spot {cell}',
  'map.guideAlt': 'Guide map of {area}',
  'map.mapAlt': 'Map of {area}',
  'map.guideFallback': 'A guide map of the area.',

  'area.east8': 'East Hall 8 Cosplay Area (indoor & outdoor)',
  'area.east8in': 'East Hall 8 Cosplay Area (indoor)',
  'area.antenna': 'Antenna Site Cosplay Area (outside East 7)',
  'area.garden': 'Garden Cosplay Area',
  'area.rooftop': 'Rooftop Exhibition Cosplay Area',
  'area.rest': 'On a break',

  'search.title': 'Where is everyone?',
  'search.intro': 'Search posted locations on X. Enter an account to narrow it to one person.',
  'search.scope': 'Whose posts',
  'search.scopeAll': 'Everyone',
  'search.scopeFollows': 'Only people you follow',
  'search.scopeFollowsHelp': 'Based on the account currently signed in to X.',
  'search.account': 'Account',
  'search.accountHelpAll': 'Leave it empty to search posts from everyone.',
  'search.accountHelpFollows': 'Leave it empty to search everyone you follow.',
  'search.range': 'How recent',
  'search.range1': 'Last 1 hour',
  'search.range3': 'Last 3 hours',
  'search.range6': 'Last 6 hours',
  'search.rangeAny': 'Any time',
  'search.since': 'Searching posts from {time} onward.',
  'search.submit': 'Search on X',
  'search.note': 'Results are shown newest first.',
  'search.panelLabel': 'Find posts',

  'footer.note1': 'West Hall 4 is not a cosplay area.',
  'footer.note2': 'Cosplay areas may be restricted in bad weather such as rain.',
  'footer.privacy':
    'Nothing you enter is stored; it is handed to the X posting screen. Please do not write personally identifying information or abuse.',

  'lang.select': 'Select Language',
  'nav.label': 'Switch view',
};

const zh: Record<MessageKey, string> = {
  'tab.post': '发布模式',
  'tab.find': '查找模式',

  'common.optional': '选填',

  'post.title': '我现在在这里！',
  'post.intro': '只需选择地点和状态。发布前可以确认内容。',
  'post.place': '地点',
  'post.selectArea': '选择区域',
  'post.areaMeta': '{floor}／第1天 {day1}／第2天 {day2}',
  'post.areaNotice':
    '黄色部分仅为预计区域，当天情况可能有所不同。请将其作为大致位置使用。另外，东7・8区域无法指定，敬请谅解。',
  'post.status': '当前状态',
  'post.note': '留言',
  'post.xId': 'X的账号',
  'post.xIdHelp': '填写后，链接页面会显示「@某某 的当前位置」。@可加可不加。',
  'post.xIdError': '仅限字母、数字和下划线，最多15个字符',
  'post.length': 'X的字数 {count} / {max}',
  'post.lengthOver': '超过X的上限（{count} / {max}），请缩短留言。',
  'post.submit': '发布到X',
  'post.submitNote': '将在X的界面确认并编辑后发布。',
  'post.previewLabel': 'X发布内容预览',

  'status.1': '拍摄中',
  'status.2': '交流中',
  'status.4': '正前往',

  'map.guideTitle': '区域指南',
  'map.question': '在地图上的哪里？',
  'map.help': '请点击大致位置。',
  'map.selected': '已选择: {cell}',
  'map.notSelected': '请选择位置',
  'map.cellLabel': '位置 {cell}',
  'map.guideAlt': '{area}的指南图',
  'map.mapAlt': '{area}的平面图',
  'map.guideFallback': '这是区域的指南图。',

  'area.east8': '东8展馆Cosplay区（内＋外）',
  'area.east8in': '东8展馆Cosplay区（内）',
  'area.antenna': '东7外天线场地Cosplay区',
  'area.garden': '庭园Cosplay区',
  'area.rooftop': '屋顶展示场Cosplay区',
  'area.rest': '休息中',

  'search.title': '大家在哪里？',
  'search.intro': '在X上查找已发布的地点。输入账号可只查看该用户。',
  'search.scope': '谁的发布',
  'search.scopeAll': '所有人',
  'search.scopeFollows': '仅关注的人',
  'search.scopeFollowsHelp': '以当前登录X的账号的关注为准。',
  'search.account': '账号',
  'search.accountHelpAll': '留空则查找所有人的发布。',
  'search.accountHelpFollows': '留空则查找所有关注的人。',
  'search.range': '发布时间',
  'search.range1': '最近1小时',
  'search.range3': '最近3小时',
  'search.range6': '最近6小时',
  'search.rangeAny': '不限',
  'search.since': '查找 {time} 之后的发布。',
  'search.submit': '在X上查找',
  'search.note': '按最新顺序显示。',
  'search.panelLabel': '查找发布',

  'footer.note1': '西4展馆不是Cosplay区。',
  'footer.note2': '遇雨等恶劣天气时，Cosplay区可能会限制使用。',
  'footer.privacy': '输入内容不会被保存，仅传递至X的发布界面。请勿填写可识别个人的信息或诽谤中伤内容。',

  'lang.select': 'Select Language',
  'nav.label': '切换画面',
};

const ko: Record<MessageKey, string> = {
  'tab.post': '올리기 모드',
  'tab.find': '찾기 모드',

  'common.optional': '선택',

  'post.title': '지금, 여기예요!',
  'post.intro': '장소와 상태만 고르면 됩니다. 올리기 전에 내용을 확인할 수 있어요.',
  'post.place': '장소',
  'post.selectArea': '구역 선택',
  'post.areaMeta': '{floor}／1일차 {day1}／2일차 {day2}',
  'post.areaNotice':
    '노란색 부분은 어디까지나 예상 구역이며 당일 상황에 따라 다를 수 있습니다. 대략적인 위치를 나타내는 용도로 사용해 주세요. 또한 동7・8 구역은 지정할 수 없는 점 양해 부탁드립니다.',
  'post.status': '현재 상태',
  'post.note': '한마디',
  'post.xId': 'X 아이디',
  'post.xIdHelp': '입력하면 링크된 페이지에 「@○○ 님의 현재 위치」가 표시됩니다. @는 있어도 없어도 됩니다.',
  'post.xIdError': '영문, 숫자, 밑줄만 사용하여 15자 이내',
  'post.length': 'X 글자 수 {count} / {max}',
  'post.lengthOver': 'X의 상한을 넘었습니다 ({count} / {max}). 한마디를 줄여 주세요.',
  'post.submit': 'X에 올리기',
  'post.submitNote': 'X 화면에서 내용을 확인하고 수정한 뒤 게시됩니다.',
  'post.previewLabel': 'X 게시물 미리보기',

  'status.1': '촬영 중',
  'status.2': '대화 중',
  'status.4': '가는 중',

  'map.guideTitle': '구역 안내',
  'map.question': '지도에서 어디인가요?',
  'map.help': '대략적인 위치를 탭해 주세요.',
  'map.selected': '선택 중: {cell}',
  'map.notSelected': '위치를 선택해 주세요',
  'map.cellLabel': '위치 {cell}',
  'map.guideAlt': '{area}의 안내도',
  'map.mapAlt': '{area}의 배치도',
  'map.guideFallback': '구역 안내도입니다.',

  'area.east8': '동8홀 코스프레 구역 (실내＋실외)',
  'area.east8in': '동8홀 코스프레 구역 (실내)',
  'area.antenna': '동7 외부 안테나 사이트 코스프레 구역',
  'area.garden': '정원 코스프레 구역',
  'area.rooftop': '옥상 전시장 코스프레 구역',
  'area.rest': '휴식 중',

  'search.title': '지금, 어디예요?',
  'search.intro': '올라온 장소를 X에서 찾습니다. 계정을 입력하면 그 사람만 볼 수 있어요.',
  'search.scope': '누구의 게시물',
  'search.scopeAll': '모든 사람',
  'search.scopeFollows': '팔로우 중인 사람만',
  'search.scopeFollowsHelp': 'X에 로그인한 본인의 팔로우가 기준입니다.',
  'search.account': '계정',
  'search.accountHelpAll': '비워두면 올린 사람 전체에서 찾습니다.',
  'search.accountHelpFollows': '비워두면 팔로우 중인 사람 전체에서 찾습니다.',
  'search.range': '언제 올린 것',
  'search.range1': '최근 1시간',
  'search.range3': '최근 3시간',
  'search.range6': '최근 6시간',
  'search.rangeAny': '지정 안 함',
  'search.since': '{time} 이후의 게시물을 찾습니다.',
  'search.submit': 'X에서 찾기',
  'search.note': '최신순으로 표시됩니다.',
  'search.panelLabel': '게시물 찾기',

  'footer.note1': '서4홀은 코스프레 구역이 아닙니다.',
  'footer.note2': '비 등 악천후로 코스프레 구역 사용이 제한될 수 있습니다.',
  'footer.privacy':
    '입력한 내용은 저장되지 않고 X의 게시 화면으로 전달됩니다. 개인을 특정할 수 있는 정보나 비방은 쓰지 말아 주세요.',

  'lang.select': 'Select Language',
  'nav.label': '화면 전환',
};

const es: Record<MessageKey, string> = {
  'tab.post': 'Modo publicar',
  'tab.find': 'Modo buscar',

  'common.optional': 'opcional',

  'post.title': '¡Estoy aquí!',
  'post.intro': 'Solo elige un lugar y un estado. Puedes revisarlo antes de publicar.',
  'post.place': 'Lugar',
  'post.selectArea': 'Elige una zona',
  'post.areaMeta': '{floor} / Día 1 {day1} / Día 2 {day2}',
  'post.areaNotice':
    'Las zonas amarillas son aproximadas y pueden variar el mismo día. Úsalas para indicar una ubicación aproximada. Ten en cuenta que las zonas Este 7 y 8 no se pueden precisar.',
  'post.status': 'Estado actual',
  'post.note': 'Mensaje',
  'post.xId': 'Usuario de X',
  'post.xIdHelp':
    'Si lo indicas, la página enlazada mostrará «aquí está @tu_usuario». La @ es opcional.',
  'post.xIdError': 'Solo letras, números y guiones bajos, hasta 15 caracteres',
  'post.length': 'Longitud en X: {count} / {max}',
  'post.lengthOver': 'Superas el límite de X ({count} / {max}). Acorta tu mensaje.',
  'post.submit': 'Publicar en X',
  'post.submitNote': 'Podrás revisar y editar el texto en X antes de publicarlo.',
  'post.previewLabel': 'Vista previa de tu publicación en X',

  'status.1': 'Fotografiando',
  'status.2': 'Charlando',
  'status.4': 'De camino',

  'map.guideTitle': 'Guía de la zona',
  'map.question': '¿Dónde en el mapa?',
  'map.help': 'Toca aproximadamente dónde estás.',
  'map.selected': 'Seleccionado: {cell}',
  'map.notSelected': 'Elige un punto',
  'map.cellLabel': 'Punto {cell}',
  'map.guideAlt': 'Mapa guía de {area}',
  'map.mapAlt': 'Plano de {area}',
  'map.guideFallback': 'Mapa guía de la zona.',

  'area.east8': 'Zona de cosplay del Pabellón Este 8 (interior y exterior)',
  'area.east8in': 'Zona de cosplay del Pabellón Este 8 (interior)',
  'area.antenna': 'Zona de cosplay Antenna Site (exterior del Este 7)',
  'area.garden': 'Zona de cosplay del jardín',
  'area.rooftop': 'Zona de cosplay de la azotea',
  'area.rest': 'En descanso',

  'search.title': '¿Dónde están?',
  'search.intro': 'Busca en X los lugares publicados. Indica una cuenta para ver solo a esa persona.',
  'search.scope': 'Publicaciones de',
  'search.scopeAll': 'Todos',
  'search.scopeFollows': 'Solo a quienes sigues',
  'search.scopeFollowsHelp': 'Se basa en la cuenta con la que has iniciado sesión en X.',
  'search.account': 'Cuenta',
  'search.accountHelpAll': 'Déjalo vacío para buscar entre todas las publicaciones.',
  'search.accountHelpFollows': 'Déjalo vacío para buscar entre todos los que sigues.',
  'search.range': 'Antigüedad',
  'search.range1': 'Última hora',
  'search.range3': 'Últimas 3 horas',
  'search.range6': 'Últimas 6 horas',
  'search.rangeAny': 'Sin límite',
  'search.since': 'Buscando publicaciones desde {time}.',
  'search.submit': 'Buscar en X',
  'search.note': 'Se muestran de más reciente a más antiguo.',
  'search.panelLabel': 'Buscar publicaciones',

  'footer.note1': 'El Pabellón Oeste 4 no es zona de cosplay.',
  'footer.note2': 'Las zonas de cosplay pueden restringirse si hace mal tiempo.',
  'footer.privacy':
    'Nada de lo que escribas se guarda; se envía a la pantalla de publicación de X. No escribas datos personales ni insultos.',

  'lang.select': 'Select Language',
  'nav.label': 'Cambiar de vista',
};

const fr: Record<MessageKey, string> = {
  'tab.post': 'Mode publication',
  'tab.find': 'Mode recherche',

  'common.optional': 'facultatif',

  'post.title': 'Je suis ici !',
  'post.intro': 'Choisissez simplement un lieu et un statut. Vous pourrez vérifier avant de publier.',
  'post.place': 'Lieu',
  'post.selectArea': 'Choisir une zone',
  'post.areaMeta': '{floor} / Jour 1 {day1} / Jour 2 {day2}',
  'post.areaNotice':
    "Les zones en jaune sont approximatives et peuvent différer le jour même. Utilisez-les pour indiquer un emplacement approximatif. Les zones Est 7 et 8 ne peuvent pas être précisées.",
  'post.status': 'Statut actuel',
  'post.note': 'Message',
  'post.xId': 'Identifiant X',
  'post.xIdHelp':
    "Si vous l'indiquez, la page liée affichera « @vous est ici ». Le @ est facultatif.",
  'post.xIdError': 'Lettres, chiffres et tirets bas uniquement, 15 caractères maximum',
  'post.length': 'Longueur sur X : {count} / {max}',
  'post.lengthOver': 'Limite de X dépassée ({count} / {max}). Raccourcissez votre message.',
  'post.submit': 'Publier sur X',
  'post.submitNote': 'Vous pourrez relire et modifier le texte sur X avant de publier.',
  'post.previewLabel': 'Aperçu de votre publication sur X',

  'status.1': 'En séance photo',
  'status.2': 'En discussion',
  'status.4': 'En route',

  'map.guideTitle': 'Guide de la zone',
  'map.question': 'Où sur le plan ?',
  'map.help': 'Touchez approximativement votre position.',
  'map.selected': 'Sélectionné : {cell}',
  'map.notSelected': 'Choisissez un emplacement',
  'map.cellLabel': 'Emplacement {cell}',
  'map.guideAlt': 'Plan indicatif de {area}',
  'map.mapAlt': 'Plan de {area}',
  'map.guideFallback': "Plan indicatif de la zone.",

  'area.east8': 'Zone cosplay Hall Est 8 (intérieur et extérieur)',
  'area.east8in': 'Zone cosplay Hall Est 8 (intérieur)',
  'area.antenna': "Zone cosplay Antenna Site (extérieur Est 7)",
  'area.garden': 'Zone cosplay du jardin',
  'area.rooftop': 'Zone cosplay du toit-terrasse',
  'area.rest': 'En pause',

  'search.title': 'Ils sont où ?',
  'search.intro': 'Cherchez les lieux publiés sur X. Indiquez un compte pour ne voir que cette personne.',
  'search.scope': 'Publications de',
  'search.scopeAll': 'Tout le monde',
  'search.scopeFollows': 'Uniquement vos abonnements',
  'search.scopeFollowsHelp': 'Basé sur le compte connecté à X.',
  'search.account': 'Compte',
  'search.accountHelpAll': 'Laissez vide pour chercher parmi toutes les publications.',
  'search.accountHelpFollows': 'Laissez vide pour chercher parmi tous vos abonnements.',
  'search.range': 'Ancienneté',
  'search.range1': 'Dernière heure',
  'search.range3': 'Dernières 3 heures',
  'search.range6': 'Dernières 6 heures',
  'search.rangeAny': 'Sans limite',
  'search.since': 'Recherche des publications depuis {time}.',
  'search.submit': 'Chercher sur X',
  'search.note': 'Affichées de la plus récente à la plus ancienne.',
  'search.panelLabel': 'Chercher des publications',

  'footer.note1': "Le Hall Ouest 4 n'est pas une zone cosplay.",
  'footer.note2': 'Les zones cosplay peuvent être restreintes en cas de mauvais temps.',
  'footer.privacy':
    "Rien de ce que vous saisissez n'est conservé : tout est transmis à l'écran de publication de X. N'y écrivez pas d'informations personnelles ni d'insultes.",

  'lang.select': 'Select Language',
  'nav.label': 'Changer de vue',
};

export const messages: Record<LanguageCode, Record<MessageKey, string>> = { ja, en, zh, ko, es, fr };
