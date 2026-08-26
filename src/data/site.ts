/**
 * ============================================================
 *  PUSAT DATA SITUS — BEM FSM UNDIP 2026 "Kabinet Bara Momentum"
 *  Edit file ini untuk memperbarui konten tanpa menyentuh kode UI.
 * ============================================================
 */

/* ---------------- Identitas & Navigasi ---------------- */
export const SITE = {
  name: "BEM FSM UNDIP 2026",
  cabinet: "Kabinet Bara Momentum",
  tagline: "Bara Berdaya, Momentum Berkarya",
  description:
    "Website resmi Badan Eksekutif Mahasiswa Fakultas Sains dan Matematika Universitas Diponegoro 2026, Kabinet Bara Momentum.",
  instagram: "@bemfsm_undip",
  instagramUrl: "https://instagram.com/bemfsm_undip",
  website: "bemfsmundip.co.id",
  websiteUrl: "https://bemfsmundip.co.id",
  email: "bemfsm@undip.ac.id",
  youtube: "https://www.youtube.com/@bemfsmundip",
};

export const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/tentang" },
  { label: "Bidang/Biro", href: "/bidang" },
  { label: "Informasi", href: "/informasi" },
] as const;

/* ---------------- Database Informasi (Beranda) ---------------- */
export type DatabaseCard = {
  title: string;
  description: string;
  icon: string; // key untuk komponen ikon
  href: string;
};

export const DATABASE_CARDS: DatabaseCard[] = [
  {
    title: "SERASA",
    description: "Sistem Edukasi & Ruang Aspirasi Mahasiswa.",
    icon: "megaphone",
    href: "#serasa",
  },
  {
    title: "Info Lomba",
    description: "Kompetisi akademik & non-akademik terkini.",
    icon: "trophy",
    href: "#lomba",
  },
  {
    title: "Info Magang",
    description: "Peluang magang & pengembangan karier.",
    icon: "briefcase",
    href: "#magang",
  },
  {
    title: "Info Beasiswa",
    description: "Beasiswa internal maupun eksternal kampus.",
    icon: "scholarship",
    href: "#beasiswa",
  },
  {
    title: "Database Sponsorship",
    description: "Jejaring mitra & sponsor untuk kegiatan.",
    icon: "handshake",
    href: "#sponsorship",
  },
  {
    title: "Kalender Akademik",
    description: "Agenda penting sepanjang tahun akademik.",
    icon: "calendar",
    href: "#kalender",
  },
];

/* ---------------- Video Company Profile ---------------- */
export const COMPANY_PROFILE = {
  // Ganti dengan ID video YouTube resmi
  youtubeId: "dQw4w9WgXcQ",
  title: "Company Profile BEM FSM UNDIP 2026",
  subtitle: "Mengenal lebih dekat Kabinet Bara Momentum",
};

/* ---------------- Tentang Kami ---------------- */
export const VISI =
  "BEM FSM 2026 sebagai ruang progresif yang mendorong peningkatan potensi mahasiswa dengan menyalakan Bara Semangat dalam Momentum Perubahan untuk menghadirkan kebermanfaatan nyata bagi mahasiswa FSM Undip, Undip, dan masyarakat.";

export const MISI: string[] = [
  "Menguatkan internal yang kompeten dan profesional melalui kultur kerja yang solid, sinergis, dan berorientasi kualitas.",
  "Meningkatkan kualitas komunikasi, informasi, dan kolaborasi eksternal yang didukung pengolahan data statistik.",
  "Menumbuhkan jiwa altruistik dan kesiapan pembinaan karakter, kapasitas keilmuan, serta potensi mahasiswa.",
  "Mengembangkan potensi mahasiswa secara inklusif dengan ruang belajar, ruang karya, dan kewirausahaan melalui growth mindset.",
  "Mendorong momentum perubahan yang inklusif untuk merespons dinamika kampus demi kenyamanan mahasiswa.",
  "Menghadirkan peran kritis mahasiswa yang peka pada isu sosial melalui aksi nyata di masyarakat.",
];

export const CORE_VALUES = [
  {
    title: "Progresif",
    description:
      "Bergerak maju dengan gagasan baru, berani melangkah, dan adaptif terhadap perubahan.",
    icon: "spark",
  },
  {
    title: "Profesional",
    description:
      "Bekerja dengan standar kualitas tinggi, bertanggung jawab, dan berorientasi hasil.",
    icon: "shield",
  },
  {
    title: "Altruistik",
    description:
      "Mengutamakan kebermanfaatan bagi sesama dan masyarakat di atas kepentingan pribadi.",
    icon: "heart",
  },
  {
    title: "Inklusivitas",
    description:
      "Membuka ruang setara bagi seluruh mahasiswa tanpa memandang latar belakang.",
    icon: "globe",
  },
];

export const PHILOSOPHY = {
  name: [
    {
      key: "BARA",
      meaning:
        "Semangat yang membara serta fondasi soliditas yang menjadi sumber energi pergerakan.",
    },
    {
      key: "MOMENTUM",
      meaning:
        "Aksi yang terukur untuk menciptakan dampak nyata dan berkelanjutan.",
    },
  ],
  logo: [
    "Nyala api terbentuk dari huruf B di kiri (Bara) dan huruf M di kanan (Momentum).",
    "Tujuh garis salur melambangkan 7 program studi & 7 ormawa di lingkungan FSM.",
    "Warna oranye merepresentasikan antusiasme dan kreativitas.",
    "Warna merah merepresentasikan keberanian dan determinasi.",
  ],
  workCulture: ["Critical Thinking", "Growth Mindset"],
  ethics: "Sura Dira Jayaningrat, Lebur Dening Pangastuti",
};

/* ---------------- Bidang / Biro ---------------- */
export type Division = {
  name: string;
  type: "Bidang" | "Biro";
  description: string;
  icon: string;
};

export const DIVISIONS: Division[] = [
  {
    name: "Sekretaris Kabinet",
    type: "Biro",
    description:
      "Mengelola administrasi, kesekretariatan, dan tata kelola organisasi.",
    icon: "shield",
  },
  {
    name: "Bendahara Kabinet",
    type: "Biro",
    description:
      "Mengatur keuangan, transparansi anggaran, dan pertanggungjawaban dana.",
    icon: "briefcase",
  },
  {
    name: "PSDM",
    type: "Bidang",
    description:
      "Pengembangan Sumber Daya Mahasiswa: kaderisasi dan pembinaan karakter.",
    icon: "spark",
  },
  {
    name: "Sosial Masyarakat",
    type: "Bidang",
    description:
      "Menggerakkan aksi nyata dan pengabdian untuk masyarakat sekitar.",
    icon: "heart",
  },
  {
    name: "Kajian & Aksi Strategis",
    type: "Bidang",
    description:
      "Mengawal isu kampus dan publik melalui kajian kritis serta advokasi.",
    icon: "megaphone",
  },
  {
    name: "Ekonomi Kreatif",
    type: "Bidang",
    description:
      "Mendorong kewirausahaan dan kemandirian finansial mahasiswa.",
    icon: "trophy",
  },
  {
    name: "Komunikasi & Informasi",
    type: "Bidang",
    description:
      "Mengelola media, branding, dan penyebaran informasi organisasi.",
    icon: "globe",
  },
  {
    name: "Hubungan Luar",
    type: "Bidang",
    description:
      "Membangun jejaring, kolaborasi, dan kemitraan strategis eksternal.",
    icon: "handshake",
  },
  {
    name: "Pengembangan Akademik",
    type: "Bidang",
    description:
      "Memfasilitasi prestasi, lomba, beasiswa, dan iklim akademik mahasiswa.",
    icon: "scholarship",
  },
];

/* ---------------- Informasi / Artikel ---------------- */
export const INFO_CATEGORIES = [
  "Semua",
  "Kegiatan",
  "Prestasi",
  "Informasi",
  "Beasiswa",
  "Lomba",
] as const;

export type InfoCategory = Exclude<(typeof INFO_CATEGORIES)[number], "Semua">;

export type Article = {
  id: string;
  title: string;
  category: InfoCategory;
  date: string; // ISO date
  image: string;
  excerpt: string;
  href: string;
  pinned?: boolean;
  content: string; // full article body
};

export const ARTICLES: Article[] = [
  {
    id: "1",
    title: "Peluncuran Program Strategis: Harmoni Cita untuk FSM Lebih Unggul",
    category: "Kegiatan",
    date: "2026-06-28",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=70",
    excerpt:
      "Kabinet Bara Momentum resmi meluncurkan rangkaian program kerja unggulan yang berfokus pada inovasi riset dan kesejahteraan mahasiswa.",
    href: "/informasi/1",
    pinned: true,
    content:
      "Dalam sebuah acara yang dihadiri oleh seluruh jajaran pengurus BEM FSM UNDIP 2026, Kabinet Bara Momentum secara resmi meluncurkan program strategis bertajuk 'Harmoni Cita'. Program ini merupakan peta jalan komprehensif yang akan menjadi panduan kerja kabinet selama satu periode kepengurusan.\n\nProgram Harmoni Cita terdiri dari empat pilar utama: Penguatan Ekosistem Karya, Akses Informasi Terpadu, Advokasi & Aspirasi Nyata, serta Kolaborasi Lintas Sains. Setiap pilar dirancang untuk menjawab kebutuhan konkret mahasiswa FSM UNDIP.\n\n'Kami ingin memastikan bahwa setiap program yang kami jalankan memiliki dampak nyata dan terukur bagi mahasiswa,' ujar Ketua BEM FSM UNDIP 2026 dalam sambutannya. 'Bara Momentum bukan sekadar nama, tapi komitmen untuk menyalakan semangat perubahan di fakultas kita.'\n\nPeluncuran ini juga menandai dimulainya fase eksekusi dari rencana kerja yang telah disusun selama masa transisi. Seluruh bidang dan biro diharapkan dapat bersinergi untuk mewujudkan visi 'Bara Berdaya, Momentum Berkarya'.",
  },
  {
    id: "2",
    title: "Open Recruitment Panitia LKMM 2026",
    category: "Kegiatan",
    date: "2026-06-25",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=70",
    excerpt:
      "Latihan Keterampilan Manajemen Mahasiswa kembali hadir. Kami membuka pendaftaran panitia untuk seluruh mahasiswa FSM.",
    href: "/informasi/2",
    content:
      "BEM FSM UNDIP 2026 melalui Bidang PSDM mengumumkan pembukaan rekrutmen panitia untuk pelaksanaan Latihan Keterampilan Manajemen Mahasiswa (LKMM) tahun 2026. Kegiatan ini merupakan salah satu program unggulan dalam pilar Penguatan Ekosistem Karya.\n\nLKMM dirancang sebagai wadah pengembangan soft skills dan leadership bagi mahasiswa FSM. Panitia yang terpilih akan mendapatkan kesempatan untuk mengasah kemampuan organisasi, komunikasi, dan manajerial.\n\nPendaftaran dibuka mulai 25 Juni hingga 10 Juli 2026. Formulir pendaftaran dapat diakses melalui link yang tersedia di bio Instagram @bemfsm_undip. Persyaratan meliputi mahasiswa aktif FSM UNDIP minimal semester 2, memiliki komitmen waktu yang cukup, dan bersedia mengikuti seluruh rangkaian kegiatan.",
  },
  {
    id: "3",
    title: "Tim Riset FSM Raih Medali Emas Internasional",
    category: "Prestasi",
    date: "2026-06-20",
    image:
      "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1200&q=70",
    excerpt:
      "Delegasi mahasiswa FSM berhasil meraih medali emas pada kompetisi riset internasional di Seoul, Korea Selatan.",
    href: "/informasi/3",
    content:
      "Kabar membanggakan datang dari delegasi mahasiswa Fakultas Sains dan Matematika UNDIP yang berhasil meraih medali emas pada International Science Innovation Competition (ISIC) 2026 di Seoul, Korea Selatan.\n\nTim yang terdiri dari tiga mahasiswa program studi Fisika dan Matematika ini mempresentasikan riset bertema 'Novel Approach to Quantum Computing Optimization Using Topological Methods'. Riset ini mendapat apresiasi tinggi dari panel juri internasional.\n\n'Keberhasilan ini adalah bukti bahwa mahasiswa FSM UNDIP mampu bersaing di kancah global,' ungkap pembimbing tim. Prestasi ini juga menjadi motivasi bagi mahasiswa lain untuk terus mengembangkan kapasitas riset dan inovasi.\n\nBEM FSM UNDIP mengucapkan selamat kepada seluruh anggota tim dan berkomitmen untuk terus memfasilitasi pengembangan prestasi mahasiswa melalui berbagai program di Bidang Pengembangan Akademik.",
  },
  {
    id: "4",
    title: "Panduan Registrasi Semester Genap 2026",
    category: "Informasi",
    date: "2026-06-18",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=70",
    excerpt:
      "Panduan lengkap proses registrasi semester genap, termasuk jadwal pengisian KRS dan pembayaran UKT.",
    href: "/informasi/4",
    content:
      "Memasuki periode registrasi semester genap 2026/2027, BEM FSM UNDIP menyusun panduan lengkap untuk membantu mahasiswa dalam menyelesaikan proses administrasi akademik.\n\nBerikut timeline penting yang perlu dicatat:\n- Pembayaran UKT: 1-15 Juli 2026\n- Pengisian KRS: 16-20 Juli 2026\n- Perwalian Akademik: 21-25 Juli 2026\n- Awal Perkuliahan: 28 Juli 2026\n\nMahasiswa diimbau untuk segera melakukan pembayaran UKT sesuai jadwal yang ditentukan. Bagi yang mengalami kendala finansial, dapat mengajukan keringanan UKT melalui Bidang Kemahasiswaan.\n\nUntuk informasi lebih lanjut, silakan hubungi Bidang Pengembangan Akademik BEM FSM atau kunjungi portal akademik UNDIP.",
  },
  {
    id: "5",
    title: "Pembukaan Pendaftaran Beasiswa PPA Tahun 2026",
    category: "Beasiswa",
    date: "2026-06-15",
    image:
      "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=1200&q=70",
    excerpt:
      "Kesempatan emas bagi seluruh mahasiswa FSM Undip untuk mengajukan beasiswa Peningkatan Prestasi Akademik.",
    href: "/informasi/5",
    content:
      "Kementerian Pendidikan dan Kebudayaan membuka pendaftaran Beasiswa Peningkatan Prestasi Akademik (PPA) untuk tahun akademik 2026/2027. Beasiswa ini ditujukan bagi mahasiswa yang memiliki prestasi akademik dan non-akademik yang membanggakan.\n\nPersyaratan umum:\n- Mahasiswa aktif minimal semester 3\n- IPK minimal 3.00\n- Tidak sedang menerima beasiswa lain dari sumber APBN\n- Aktif dalam kegiatan kemahasiswaan\n\nBerkas yang diperlukan meliputi transkrip nilai, surat keterangan aktif, portofolio prestasi, dan esai motivasi. Pendaftaran dibuka hingga 30 Juni 2026 melalui sistem beasiswa online UNDIP.\n\nBEM FSM melalui Bidang Pengembangan Akademik siap membantu mahasiswa dalam proses penyusunan berkas. Konsultasi dapat dilakukan melalui DM Instagram @bemfsm_undip.",
  },
  {
    id: "6",
    title: "Workshop Kepemimpinan: Karakter Visioner",
    category: "Kegiatan",
    date: "2026-06-12",
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=70",
    excerpt:
      "Dalam upaya meningkatkan kualitas kepemimpinan mahasiswa, BEM FSM menyelenggarakan workshop intensif bersama praktisi.",
    href: "/informasi/6",
    content:
      "Bidang PSDM BEM FSM UNDIP 2026 menyelenggarakan Workshop Kepemimpinan bertajuk 'Karakter Visioner: Membangun Pemimpin Masa Depan' pada 12 Juni 2026 di Gedung Widya Puraya UNDIP.\n\nWorkshop ini menghadirkan tiga pembicara utama dari berbagai latar belakang: akademisi, praktisi startup, dan tokoh pemuda nasional. Peserta diajak untuk mengeksplorasi berbagai model kepemimpinan yang adaptif terhadap tantangan era digital.\n\nKegiatan berlangsung selama satu hari penuh dengan format interaktif, mulai dari sesi materi, diskusi kelompok, hingga simulasi pengambilan keputusan. Antusiasme peserta sangat tinggi dengan lebih dari 150 mahasiswa FSM yang mendaftar.\n\n'Workshop ini adalah bagian dari komitmen kami untuk tidak hanya menghasilkan mahasiswa yang cerdas secara akademik, tetapi juga memiliki jiwa kepemimpinan yang kuat,' jelas Kepala Bidang PSDM.",
  },
  {
    id: "7",
    title: "Pemanfaatan Lab Terintegrasi untuk Penelitian",
    category: "Informasi",
    date: "2026-06-08",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=70",
    excerpt:
      "Pengumuman skema baru akses laboratorium selama 24 jam untuk mendukung penyelesaian tugas akhir mahasiswa semester akhir.",
    href: "/informasi/7",
    content:
      "Fakultas Sains dan Matematika UNDIP mengumumkan kebijakan baru terkait akses laboratorium terintegrasi. Mulai semester genap 2026/2027, mahasiswa semester akhir yang sedang mengerjakan tugas akhir mendapatkan akses 24 jam ke fasilitas laboratorium.\n\nKebijakan ini merupakan respons dari aspirasi yang disampaikan mahasiswa melalui kanal SERASA BEM FSM. Banyak mahasiswa yang membutuhkan waktu tambahan untuk menyelesaikan eksperimen dan pengolahan data riset.\n\nUntuk mendapatkan akses, mahasiswa perlu mengajukan permohonan melalui koordinator program studi dengan melampirkan surat rekomendasi dosen pembimbing. Akses akan diberikan dalam bentuk kartu akses elektronik yang berlaku selama satu semester.\n\nBEM FSM mengapresiasi respons cepat pihak fakultas terhadap kebutuhan mahasiswa dan berharap kebijakan ini dapat mempercepat penyelesaian tugas akhir.",
  },
  {
    id: "8",
    title: "Lomba Karya Tulis Ilmiah Nasional 2026",
    category: "Lomba",
    date: "2026-06-05",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=70",
    excerpt:
      "Kompetisi karya tulis ilmiah tingkat nasional dengan total hadiah puluhan juta rupiah. Daftarkan timmu sekarang.",
    href: "/informasi/8",
    content:
      "BEM FSM UNDIP 2026 bersama Bidang Pengembangan Akademik mengumumkan pembukaan pendaftaran Lomba Karya Tulis Ilmiah (LKTI) Nasional bertajuk 'Inovasi Sains untuk Indonesia Maju'.\n\nKompetisi ini terbuka untuk seluruh mahasiswa S1 di Indonesia dengan tema besar pemanfaatan sains dan teknologi untuk pembangunan berkelanjutan. Total hadiah yang diperebutkan mencapai Rp 50.000.000.\n\nKategori lomba:\n1. Sains Murni & Terapan\n2. Teknologi & Inovasi\n3. Matematika & Komputasi\n\nSetiap tim terdiri dari 3 mahasiswa dengan 1 dosen pembimbing. Pendaftaran dibuka hingga 30 Juni 2026 melalui website resmi yang akan segera diumumkan.\n\nBagi mahasiswa FSM yang tertarik, Bidang Pengembangan Akademik menyediakan sesi mentoring penulisan karya ilmiah setiap Kamis sore di Ruang BEM.",
  },
  {
    id: "9",
    title: "Kompetisi Business Plan Mahasiswa Sains",
    category: "Lomba",
    date: "2026-05-28",
    image:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=70",
    excerpt:
      "Tuangkan ide bisnismu dan bersaing memperebutkan pendanaan untuk merealisasikan startup sains impianmu.",
    href: "/informasi/9",
    content:
      "Bidang Ekonomi Kreatif BEM FSM UNDIP menyelenggarakan Kompetisi Business Plan khusus mahasiswa sains. Kompetisi ini bertujuan untuk mendorong jiwa kewirausahaan di kalangan mahasiswa FSM.\n\nPeserta diminta untuk menyusun rencana bisnis berbasis sains dan teknologi yang memiliki potensi dampak sosial dan ekonomi. Tim pemenang akan mendapatkan pendanaan awal untuk merealisasikan ide bisnis mereka.\n\nJadwal kegiatan:\n- Pendaftaran: 28 Mei - 15 Juni 2026\n- Seleksi Proposal: 16-25 Juni 2026\n- Presentasi Final: 30 Juni 2026\n\nHadiah utama berupa pendanaan senilai Rp 15.000.000 beserta mentoring dari inkubator bisnis UNDIP. Para finalis juga berkesempatan untuk mempresentasikan ide mereka di hadapan investor.",
  },
  {
    id: "10",
    title: "Beasiswa Bantuan UKT Semester Genap",
    category: "Beasiswa",
    date: "2026-05-20",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=70",
    excerpt:
      "Program bantuan keringanan UKT untuk mahasiswa yang membutuhkan. Pelajari mekanisme dan persyaratan pengajuannya.",
    href: "/informasi/10",
    content:
      "Universitas Diponegoro melalui Bidang Kemahasiswaan membuka pendaftaran program Bantuan UKT untuk semester genap 2026/2027. Program ini ditujukan bagi mahasiswa yang mengalami kesulitan finansial.\n\nKategori bantuan:\n- Keringanan UKT 25%: untuk mahasiswa dengan penghasilan orang tua di bawah UMR\n- Keringanan UKT 50%: untuk mahasiswa yatim/piatu atau dari keluarga tidak mampu\n- Pembebasan UKT: untuk kasus khusus yang direkomendasikan oleh fakultas\n\nBerkas yang diperlukan:\n1. Surat permohonan bermaterai\n2. Fotokopi KTM dan KRS aktif\n3. Surat keterangan penghasilan orang tua\n4. Kartu Keluarga\n5. Dokumentasi pendukung lainnya\n\nBEM FSM melalui Bidang Kajian & Aksi Strategis siap mendampingi mahasiswa dalam proses pengajuan. Layanan konsultasi tersedia setiap hari kerja di Sekretariat BEM FSM.",
  },
];
