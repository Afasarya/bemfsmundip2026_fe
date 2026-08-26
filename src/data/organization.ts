export type OrganizationUnit = {
  slug: string;
  name: string;
  shortName: string;
  type: "Tim" | "Biro" | "Bidang";
  logo: string;
  summary: string;
  description: string;
  strategies: string[];
  programs?: { name: string; description: string; schedule?: string }[];
  members?: { name: string; role: string; image: string }[];
};

const logoBase = "/images/LOGO BIROBIDTIM";

export const ORGANIZATION_UNITS: OrganizationUnit[] = [
  {
    slug: "pmo", name: "Tim Penjamin Mutu Organisasi", shortName: "PMO", type: "Tim", logo: `${logoBase}/PMO.png`,
    summary: "Penjaga mutu kinerja dan budaya evaluatif internal kabinet.",
    description: "Tim Penjamin Mutu Organisasi BEM FSM berperan sebagai pengawas internal yang memastikan kualitas kinerja fungsionaris tetap profesional, progresif, altruistik, dan responsif. PMO mendorong budaya evaluatif berbasis critical thinking dan growth mindset untuk menjaga konsistensi mutu organisasi.",
    strategies: ["Menyusun dan menetapkan standar operasional prosedur pengawasan serta evaluasi kinerja.", "Mengawasi kualitas kerja fungsionaris dalam pencapaian visi, misi, tujuan, dan nilai organisasi.", "Memantau pelaksanaan tugas, program kerja, serta performa bidang dan biro.", "Mengawasi perencanaan dan pertanggungjawaban kepengurusan bersama pengurus harian.", "Memfasilitasi kegiatan yang memperkuat hubungan internal dan kapasitas pengurus."],
  },
  {
    slug: "humas", name: "Biro Hubungan Masyarakat", shortName: "Humas", type: "Biro", logo: `${logoBase}/HUMAS.png`,
    summary: "Penghubung komunikasi organisasi dengan mahasiswa dan mitra.",
    description: "Biro Humas menjadi penghubung komunikasi BEM FSM dengan mahasiswa, lembaga internal, dan mitra eksternal. Humas menyampaikan informasi organisasi, membangun kerja sama, dan menjaga citra BEM FSM tetap positif melalui kerja yang responsif dan adaptif.",
    strategies: ["Memfasilitasi kerja sama pihak internal dengan pihak eksternal maupun sebaliknya.", "Menjadi narahubung studi banding dengan organisasi mahasiswa universitas atau fakultas lain.", "Mengoptimalkan media digital sebagai ruang diplomasi, publikasi, dan branding.", "Memetakan dan membangun hubungan progresif dengan mitra yang bermanfaat bagi mahasiswa FSM."],
  },
  {
    slug: "kmi", name: "Biro Kantor Media Informasi", shortName: "KMI", type: "Biro", logo: `${logoBase}/KMI.png`,
    summary: "Pusat publikasi, desain, dokumentasi, website, dan media sosial.",
    description: "Biro KMI mengelola informasi dan media BEM FSM, mulai dari publikasi, desain, dokumentasi, hingga website dan media sosial. KMI memastikan informasi tersampaikan secara jelas, menarik, mudah dijangkau, dan konsisten dengan identitas visual organisasi.",
    strategies: ["Mengelola media sosial dan website dengan standar publikasi yang konsisten, kreatif, dan relevan.", "Meningkatkan kemampuan redaksi, desain, dan dokumentasi.", "Mengembangkan koordinasi publikasi antar bidang dan biro agar proses lebih teratur dan tepat waktu.", "Menguatkan identitas visual melalui SOP desain, perwajahan, dan gaya komunikasi yang seragam."],
  },
  {
    slug: "statistik", name: "Biro Statistik", shortName: "Statistik", type: "Biro", logo: `${logoBase}/STATISTIKA.png`,
    summary: "Pusat data untuk evaluasi dan keputusan organisasi.",
    description: "Biro Statistik mengelola pengumpulan, pengolahan, analisis, dan penyajian data BEM FSM. Setiap program kerja dan kebijakan didorong memiliki dasar data yang kuat, objektif, dan dapat dipertanggungjawabkan.",
    strategies: ["Menyediakan informasi akurat, relevan, dan mudah dipahami untuk perencanaan dan evaluasi.", "Meningkatkan partisipasi mahasiswa dalam survei melalui pendekatan komunikatif dan edukatif.", "Menyusun alur pengelolaan data yang sistematis, transparan, dan terukur.", "Menjadi pusat konsultasi data dan pendampingan metodologi bagi bidang serta biro."],
  },
  {
    slug: "psdm", name: "Bidang Pengembangan Sumber Daya Mahasiswa", shortName: "PSDM", type: "Bidang", logo: `${logoBase}/PSDM.png`,
    summary: "Ruang kaderisasi serta pengembangan karakter dan kapasitas mahasiswa.",
    description: "Bidang PSDM mengembangkan dan memberdayakan kompetensi mahasiswa FSM serta bersinergi dengan bidang kaderisasi ORMAWA FSM. Geraknya berfokus pada pengembangan soft skill dan karakter secara terstruktur, sistematis, berintegritas, dan berkelanjutan.",
    strategies: ["Menyusun kurikulum kaderisasi yang terintegrasi dan relevan.", "Mewadahi pengembangan kapasitas, keterampilan, dan potensi mahasiswa FSM.", "Mendorong kesempatan setara bagi mahasiswa untuk tumbuh, berdaya, dan berkontribusi.", "Mengintegrasikan sistem kaderisasi antar-ORMAWA FSM agar pembinaan berkesinambungan."],
  },
  {
    slug: "riskel", name: "Bidang Riset dan Keilmuan", shortName: "Riskel", type: "Bidang", logo: `${logoBase}/RISKEL.png`,
    summary: "Penggerak ekosistem riset, literasi ilmiah, dan prestasi akademik.",
    description: "Bidang Riset dan Keilmuan mengembangkan ekosistem riset mahasiswa melalui kaderisasi riset, literasi ilmiah, pendampingan akademik, dan penyelarasan lembaga riset di FSM. Akses pembelajaran dibangun sistematis dan berkelanjutan.",
    strategies: ["Mengembangkan minat riset dan budaya akademik mahasiswa.", "Memberikan informasi serta pendampingan lomba akademik, PKM, dan Mawapres.", "Membangun ekosistem riset kolaboratif bersama pemangku kepentingan akademik.", "Mengelola data prestasi mahasiswa sebagai dasar evaluasi dan pembinaan."],
  },
  {
    slug: "harkam", name: "Bidang Harmonisasi Kampus", shortName: "Harkam", type: "Bidang", logo: `${logoBase}/HARKAM.png`,
    summary: "Jembatan sinergi lembaga dan penjaga keharmonisan kampus.",
    description: "Bidang Harmonisasi Kampus menjadi jembatan strategis dalam menjaga kesinambungan dan keharmonisan FSM Undip. Bidang ini menginisiasi sinergi antar lembaga, menganalisis kebijakan, dan merespons isu secara kritis serta progresif.",
    strategies: ["Menjaga koordinasi aktif dan inklusif dengan ORMAWA FSM Undip.", "Mempertahankan komunikasi profesional dengan birokrasi FSM Undip.", "Memfasilitasi forum diskusi dan agenda kolaboratif seperti FSM Harmoni.", "Merumuskan penanganan isu secara efektif, solutif, dan progresif."],
  },
  {
    slug: "kesma", name: "Bidang Kesejahteraan Mahasiswa", shortName: "Kesma", type: "Bidang", logo: `${logoBase}/KESMA.png`,
    summary: "Layanan informasi dan pengawalan kesejahteraan mahasiswa.",
    description: "Bidang Kesejahteraan Mahasiswa menyediakan informasi, layanan, dan pengawalan isu kesejahteraan. Kesma membantu mahasiswa mengakses informasi akademik, beasiswa, karier, serta pendampingan secara cepat, akurat, dan responsif.",
    strategies: ["Meningkatkan literasi informasi akademik, beasiswa, karier, dan kesejahteraan.", "Menghadirkan layanan beasiswa, magang, dan karier secara terpadu.", "Mengawal isu UKT, akademik, dan kemahasiswaan bersama elemen FSM.", "Membangun hubungan harmonis dengan fakultas demi lingkungan yang suportif."],
  },
  {
    slug: "seniora", name: "Bidang Seni dan Olahraga", shortName: "Seniora", type: "Bidang", logo: `${logoBase}/SENIORA.png`,
    summary: "Wadah tumbuh, berlatih, dan berprestasi dalam seni serta olahraga.",
    description: "Bidang Seni dan Olahraga mengembangkan minat dan bakat mahasiswa melalui wadah latihan, kompetisi, komunitas minat, dan fasilitasi prestasi. Koordinasi terarah dibangun bersama HMD dan pihak terkait.",
    strategies: ["Menyediakan pembinaan, pendampingan, dan fasilitas pengembangan seni serta olahraga.", "Mengadakan kompetisi, pelatihan, dan apresiasi bagi mahasiswa.", "Mengelola database minat dan bakat mahasiswa.", "Mendukung mahasiswa yang berkompetisi dari persiapan hingga pelaksanaan.", "Mengayomi dan mengawasi badan semi otonom minat bakat di FSM."],
  },
  {
    slug: "ekotif", name: "Bidang Ekonomi Kreatif", shortName: "Ekotif", type: "Bidang", logo: `${logoBase}/EKOTIF.png`,
    summary: "Motor pendanaan organisasi dan kewirausahaan mahasiswa.",
    description: "Bidang Ekonomi Kreatif menggerakkan inovasi pendanaan organisasi dan memperkuat semangat kewirausahaan mahasiswa. Ekotif membangun ekosistem ekonomi kreatif yang adaptif, profesional, dan berkelanjutan di FSM.",
    strategies: ["Mengembangkan strategi penggalangan dana kreatif dan berkelanjutan.", "Memfasilitasi minat serta budaya kewirausahaan mahasiswa.", "Memberikan bimbingan bagi pengembangan usaha dan ide kreatif.", "Mengelola bisnis internal BEM FSM secara sistematis dan bertanggung jawab.", "Membangun kolaborasi ekonomi kreatif dengan pihak internal dan eksternal.", "Memetakan potensi kewirausahaan mahasiswa berbasis data."],
  },
  {
    slug: "dimas", name: "Bidang Pengabdian Masyarakat", shortName: "Dimas", type: "Bidang", logo: `${logoBase}/DIMAS.png`,
    summary: "Penggerak agenda pengabdian sosial dan lingkungan.",
    description: "Bidang Pengabdian Masyarakat menggerakkan agenda sosial dan lingkungan dengan pendekatan kolaboratif serta berkelanjutan. Koordinasi dibangun bersama ORMAWA FSM, mitra eksternal, dan desa mitra agar program tepat sasaran.",
    strategies: ["Mengoptimalkan koordinasi lintas pemangku kepentingan untuk program pengabdian.", "Menyediakan ruang volunteer yang inklusif dan bermakna.", "Memperkuat dukungan institusional fakultas bagi kegiatan pengabdian.", "Mengembangkan kemitraan jangka panjang untuk dampak yang berkelanjutan."],
  },
  {
    slug: "sospol", name: "Bidang Sosial dan Politik", shortName: "Sospol", type: "Bidang", logo: `${logoBase}/SOSPOL.png`,
    summary: "Ruang literasi, kajian, dan pengawalan isu sosial politik.",
    description: "Bidang Sosial dan Politik membangun ekosistem sosial politik yang matang, inklusif, dan berpihak pada mahasiswa serta masyarakat. Sospol menghadirkan edukasi dan ruang partisipasi untuk memahami, mengawal, dan merespons isu secara kritis.",
    strategies: ["Menguatkan literasi sosial politik melalui kajian, informasi akurat, dan dialog inklusif.", "Mengawal isu hingga menghasilkan respons atau peningkatan kesadaran publik.", "Memperluas jejaring strategis untuk memperkaya analisis dan kolaborasi.", "Mengoptimalkan publikasi edukasi politik yang menarik dan mudah dipahami."],
  },
];
