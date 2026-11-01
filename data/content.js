/* Fault Lines content. Edit briefings, connections and map places here. */
/* ================= DATA ================= */
export const UPDATED = 'November 1, 2026';
export const LEVELS = {
  3: { label: 'Active conflict', color: '#ef5350' },
  2: { label: 'High tension', color: '#f0913f' },
  1: { label: 'Watch', color: '#d9b54c' }
};
export const LINK_TYPES = {
  conflict: { label: 'Armed conflict', color: '#ff5a5f' },
  dispute: { label: 'Dispute / hostility', color: '#f5b84b' },
  alliance: { label: 'Alliance / backing', color: '#8fd0ff' },
  diplomacy: { label: 'Mediation / talks', color: '#b9a3ff' },
  trade: { label: 'Trade dependence', color: '#5fd3a6' },
  tariff: { label: 'Tariffs / trade fight', color: '#f5b84b' },
  energy: { label: 'Energy flows', color: '#4fb6ff' },
  tech: { label: 'Tech & minerals', color: '#7ef0ff' },
  money: { label: 'Money, debt & defence', color: '#f2c14e' }
};
export const ECON_TYPES = ['trade', 'tariff', 'energy', 'tech', 'money'];
export const DETAIL = { 1: 'Major', 2: 'Notable', 3: 'Significant', 4: 'Minor', 5: 'Everything' };

export const B = {
  UKR: {
    leader: 'Volodymyr Zelensky', role: 'President',
    gov: 'Semi-presidential republic, under martial law since 2022', lv: 3,
    summary: "Russia's full-scale invasion, launched on February 24, 2022, is heading into its fifth winter. The front line has barely moved in 2026, while drone and missile strikes on cities and the power grid continue. Peace talks restarted in October after stalling during the US war with Iran.",
    issues: [
      { t: 'Russia–Ukraine war', s: 'Active', d: 'Russia holds Crimea, annexed in 2014, and large parts of Donetsk, Luhansk, Zaporizhzhia and Kherson. The Institute for the Study of War estimates Russia has gained only about 73 km² net since January 2026 and has lost a similar amount since September.' },
      { t: 'Ceasefire talks', s: 'Stalled', d: 'US-brokered three-way talks in Abu Dhabi in February 2026 produced little, then froze once the Iran war began. In October, Zelensky said Ukraine would freeze the war along the current line of contact but would not give up more territory. Kremlin officials dismissed Ukrainian and European proposals as insufficient.' },
      { t: 'Energy war', s: 'Ongoing', d: 'Russian strikes on the grid force scheduled blackouts across Ukraine, and Kyiv says it will keep hitting Russian oil refineries with long-range drones.' }
    ],
    timeline: [
      ['Oct 21, 2026', 'Zelensky says Ukraine is ready to freeze fighting along the current front line.'],
      ['Oct 20, 2026', 'US envoy Steve Witkoff meets Ukrainian and European officials in Oslo.'],
      ['May 9–11, 2026', 'A US-mediated three-day truce is marred by fighting along the front.'],
      ['Feb 2026', 'US, Russian and Ukrainian negotiators meet in Abu Dhabi without a breakthrough.']
    ],
    sources: [
      ['ISW: Russian Offensive Campaign Assessment, Oct 21, 2026', 'https://www.criticalthreats.org/analysis/russian-offensive-campaign-assessment-october-21-2026'],
      ['Zelenskyy open to freezing front lines (Oct 21, 2026)', 'https://political.org/2026/10/21/zelenskyy-says-he-would-consider-freezing-front-lines-to-end-russia-war/'],
      ['Defense News: fighting despite US-mediated ceasefire', 'https://www.defensenews.com/news/pentagon-congress/2026/05/11/ukraine-and-russia-fight-on-despite-us-mediated-ceasefire/']
    ]
  },
  RUS: {
    leader: 'Vladimir Putin', role: 'President',
    gov: 'Federal republic with a dominant presidency', lv: 3,
    summary: 'Russia is fighting its full-scale war in Ukraine for a fifth year under heavy Western sanctions. Moscow says it wants a full settlement on its own terms rather than a ceasefire, and it leans on China, Iran and North Korea for trade and weapons.',
    issues: [
      { t: 'War in Ukraine', s: 'Active', d: 'Russian forces keep up slow, costly assaults along a front of roughly 1,200 km. In October 2026 the Kremlin rejected a freeze along current lines, saying Russia needs peace rather than a ceasefire.' },
      { t: 'Sanctions and NATO', s: 'Ongoing', d: 'Western sanctions on energy, banking and technology remain in place, and NATO states on Russia’s border continue to build up their forces.' },
      { t: 'Partners', s: 'Ongoing', d: 'China is Russia’s main economic lifeline. North Korea has supplied troops and munitions, and Iran has supplied drones. Putin hosted Syria’s new leader in Moscow in January 2026.' }
    ],
    timeline: [
      ['Oct 21, 2026', 'Kremlin dismisses Ukrainian and European ceasefire proposals as insufficient.'],
      ['May 9–11, 2026', 'Three-day truce around Victory Day; both sides report violations.'],
      ['Jan 28, 2026', 'Putin hosts Syrian interim president Ahmed al-Sharaa in Moscow.']
    ],
    sources: [
      ['ISW: Russian Offensive Campaign Assessment, Oct 21, 2026', 'https://www.criticalthreats.org/analysis/russian-offensive-campaign-assessment-october-21-2026'],
      ['Defense News: Ukraine and Russia fight on despite ceasefire', 'https://www.defensenews.com/news/pentagon-congress/2026/05/11/ukraine-and-russia-fight-on-despite-us-mediated-ceasefire/']
    ]
  },
  ISR: {
    leader: 'Benjamin Netanyahu', role: 'Prime Minister, coalition talks underway',
    gov: 'Parliamentary democracy', lv: 3,
    summary: 'Israel voted on October 27, 2026 in its first election since the October 7, 2023 Hamas attack. Exit polls showed neither Netanyahu’s bloc nor the opposition led by former army chief Gadi Eisenkot with a clear majority, and final results are due by November 4. The country is also managing a fragile Gaza ceasefire and the aftermath of its 2026 war with Iran.',
    issues: [
      { t: 'Election and coalition', s: 'Pending', d: 'Coalition talks could take weeks or months. Analysts warn of deadlock that could leave Netanyahu as caretaker or force another election in 2027.' },
      { t: 'Gaza', s: 'Fragile truce', d: 'A ceasefire has held shakily since October 10, 2025 under Trump’s 20-point plan. The hostages were returned, but Hamas disarmament has stalled, and both sides accuse each other of violations as Israeli strikes continue.' },
      { t: 'Iran war', s: 'Paused', d: 'Israel and the US began striking Iran on February 28, 2026, killing Supreme Leader Ali Khamenei. Iran fired missiles at Israel during the war. The April truce between the US and Iran also covered Lebanon.' }
    ],
    timeline: [
      ['Oct 27, 2026', 'General election; exit polls point to a hung Knesset.'],
      ['Apr 8, 2026', 'US–Iran ceasefire announced, extended to Lebanon.'],
      ['Feb 28, 2026', 'US–Israeli strikes on Iran begin.'],
      ['Jan 2026', 'Trump launches the Board of Peace to oversee Gaza.'],
      ['Oct 10, 2025', 'Gaza ceasefire takes effect.']
    ],
    sources: [
      ['Ground News: Israel votes in first election since Oct 7', 'https://ground.news/article/704bcf86-81ff-4d81-ac14-a8f01411ffb1'],
      ['Euronews: Board of Peace report blames Hamas for stalled phase two', 'https://www.euronews.com/2026/05/20/hamas-to-blame-for-lack-of-progress-on-phase-two-of-ceasefire-board-of-peace-report-says'],
      ['Qatar Tribune: US, Iran agree two-week truce', 'https://www.qatar-tribune.com/article/228074/world/us-iran-agree-two-week-truce']
    ]
  },
  PSE: {
    name: 'Palestine',
    leader: 'Mahmoud Abbas', role: 'President, Palestinian Authority',
    gov: 'Palestinian Authority in parts of the West Bank; Gaza under a technocratic committee overseen by the Board of Peace', lv: 3,
    summary: 'Gaza is in a fragile ceasefire after a war that began in October 2023, killed tens of thousands and displaced almost the entire population. Reconstruction and Hamas disarmament under the US-led Board of Peace have moved slowly.',
    issues: [
      { t: 'Board of Peace', s: 'Stalled', d: 'The board, chaired by Trump and authorized by the UN Security Council through 2027, oversees Gaza alongside a committee of Palestinian technocrats. Its May 2026 report to the UN named Hamas as the main obstacle to phase two. One analysis in June estimated Hamas still controlled about half of Gaza.' },
      { t: 'Daily violence', s: 'Ongoing', d: 'Israeli strikes continue despite the truce, and Israel and Hamas regularly accuse each other of violations.' },
      { t: 'Palestinian elections', s: 'Planned', d: 'Abbas, in office since 2005, has set presidential and legislative elections for November 2027.' }
    ],
    timeline: [
      ['Jul 8, 2026', 'Board of Peace announces a civilian "pilot zone" near Rafah.'],
      ['May 2026', 'Board of Peace reports to the UN that phase two is stuck.'],
      ['Jan 2026', 'Board of Peace and Gaza technocratic committee launched.'],
      ['Oct 10, 2025', 'Ceasefire takes effect.']
    ],
    sources: [
      ['FDD: Gaza ceasefire and NCAG tracker', 'https://www.fdd.org/topic/national-committee-for-the-administration-of-gaza-2/'],
      ['RANE: What to make of Trump’s Board of Peace', 'https://worldview.ranenetwork.com/content/analysis/2026-01-23/what-to-make-of-trump-s-board-of-peace'],
      ['Times of Israel: elections set for Nov 2027', 'https://www.timesofisrael.com/liveblog_entry/abbas-scraps-legislative-election-sets-nov-2027-for-palestinians-to-elect-president-and-legislature/']
    ]
  },
  IRN: {
    leader: 'Ayatollah Mojtaba Khamenei', role: 'Supreme Leader since March 2026',
    second: ['President', 'Masoud Pezeshkian'],
    gov: 'Islamic republic; the Supreme Leader holds final authority', lv: 3,
    summary: 'Iran fought a war with the United States and Israel in 2026. Strikes that began on February 28 killed Supreme Leader Ali Khamenei, and his son Mojtaba was named successor on March 9. Control of the Strait of Hormuz became Iran’s main leverage, and a shaky series of truces and interim deals has followed.',
    issues: [
      { t: 'War with the US and Israel', s: 'Truce, unresolved', d: 'A two-week ceasefire on April 8, brokered with Pakistan’s help, temporarily reopened Hormuz. Talks in Islamabad ended without a deal. An interim agreement in mid-June lifted the US naval blockade, but clashes in July led Trump to declare the ceasefire over while technical talks continued.' },
      { t: 'Strait of Hormuz', s: 'Negotiating', d: 'About a fifth of the world’s oil normally passes through the strait. Iran and Oman have been negotiating a shipping arrangement, and in late September a US official said a deal was expected soon.' },
      { t: 'Crackdown at home', s: 'Ongoing', d: 'Mass protests in early 2026 were met with a deadly crackdown. The rights group HRANA said it had confirmed more than 6,500 protesters killed.' }
    ],
    timeline: [
      ['Sep 25, 2026', 'US official says an Iran–Oman Hormuz deal is expected soon.'],
      ['Jul 10, 2026', 'Trump declares the ceasefire over after two days of clashes.'],
      ['Jun 17, 2026', 'US–Iran interim deal signed; blockade lifted.'],
      ['Apr 8, 2026', 'Two-week ceasefire; Hormuz temporarily reopens.'],
      ['Mar 9, 2026', 'Mojtaba Khamenei named Supreme Leader.'],
      ['Feb 28, 2026', 'US–Israeli strikes kill Ali Khamenei.']
    ],
    sources: [
      ['WUSF/NPR: White House confirms Khamenei’s death', 'https://www.wusf.org/2026-02-28/white-house-confirms-death-of-irans-supreme-leader-ayatollah-ali-khamenei'],
      ['Express Tribune: Mojtaba Khamenei named Supreme Leader', 'https://tribune.com.pk/story/2596544/mojtaba-khamenei-named-irans-supreme-leader'],
      ['TradeWinds: US–Iran deal signed (Jun 17)', 'https://www.tradewindsnews.com/tankers/us-iran-deal-signed-confirms-hormuz-opening-within-30-days-no-tolls-for-60/2-1-2005708'],
      ['Oman Observer: Oman–Iran Hormuz deal expected soon', 'https://www.omanobserver.om/article/1194118/world/region/oman-iran-deal-on-hormuz-expected-soon-us-iran-officials'],
      ['Gulf News: US–Iran talks in Oman; HRANA toll', 'https://gulfnews.com/amp/story/world%2Famericas%2Ftrump-hails-us-talks-with-iran-in-oman-very-good-more-negotiations-expected-1.500434956']
    ]
  },
  USA: {
    name: 'United States',
    leader: 'Donald Trump', role: 'President',
    gov: 'Federal presidential republic', lv: 2,
    summary: 'The US is directly involved in more of 2026’s flashpoints than any other country. It fought a war with Iran, removed Venezuela’s leader by force, and is brokering talks on Ukraine, Gaza and eastern Congo.',
    issues: [
      { t: 'Iran', s: 'Truce, unresolved', d: 'US and Israeli strikes began on February 28, 2026. An interim deal in June lifted the US naval blockade, but clashes resumed in July and a Hormuz arrangement is still being negotiated.' },
      { t: 'Venezuela', s: 'Ongoing', d: 'US forces captured Nicolás Maduro in Caracas on January 3, 2026, and he is held in New York. Washington now deals with acting president Delcy Rodríguez and has moved to take control of Venezuela’s oil.' },
      { t: 'Peace brokering', s: 'Ongoing', d: 'Trump chairs Gaza’s Board of Peace, is pushing for a Russia–Ukraine deal by the end of 2026, and brokered the Congo–Rwanda agreement signed in Washington in December 2025.' },
      { t: 'China and Taiwan', s: 'Tense', d: 'A record US$11.1 billion arms package for Taiwan in December 2025 was followed by China’s largest drills yet around the island.' }
    ],
    timeline: [
      ['Oct 20, 2026', 'US envoy joins Ukraine talks in Oslo.'],
      ['Sep 22, 2026', 'Trump meets Delcy Rodríguez in New York.'],
      ['Jun 17, 2026', 'Interim deal with Iran signed.'],
      ['Feb 28, 2026', 'Strikes on Iran begin.'],
      ['Jan 3, 2026', 'US raid captures Maduro.']
    ],
    sources: [
      ['Philadelphia Inquirer: Who is Delcy Rodríguez?', 'https://www.inquirer.com/news/nation-world/delcy-rodriguez-venezuela-interm-president-20260105.html'],
      ['GPB/NPR: Rodríguez at the UN (Sep 2026)', 'https://www.gpb.org/news/2026/09/24/venezuelas-acting-leader-promises-elections-at-the-right-moment'],
      ['Zelenskyy open to freezing front lines (Oct 2026)', 'https://political.org/2026/10/21/zelenskyy-says-he-would-consider-freezing-front-lines-to-end-russia-war/']
    ]
  },
  SDN: {
    leader: 'Gen. Abdel Fattah al-Burhan', role: 'Army chief and de facto head of state',
    second: ['RSF commander', 'Mohamed Hamdan Dagalo ("Hemedti")'],
    gov: 'Military-led government; the RSF runs a rival administration in the west', lv: 3,
    summary: 'War between the army and the paramilitary Rapid Support Forces (RSF) has raged since April 2023. The UN calls it the world’s worst humanitarian crisis, with more than 14 million people forced from their homes and famine in parts of Darfur.',
    issues: [
      { t: 'Darfur', s: 'RSF control', d: 'The RSF captured El Fasher, the army’s last stronghold in Darfur, on October 26, 2025 after an 18-month siege. The UN reported credible accounts of widespread executions. The US had earlier determined that the RSF committed genocide.' },
      { t: 'Battle for Kordofan', s: 'Active', d: 'The front has moved east to Kordofan. The RSF has besieged El Obeid, a city of about half a million, while the army reopened the Khartoum–El Obeid highway in late July 2026. Heavy fighting around the city continued through August.' },
      { t: 'Foreign backing', s: 'Contested', d: 'Both sides draw on outside support, and UN Secretary-General Guterres has called for an end to foreign military backing of the warring parties.' }
    ],
    timeline: [
      ['Aug 14, 2026', 'Heavy fighting southwest and west of El Obeid.'],
      ['Jul 27, 2026', 'Hemedti urges his fighters on after the army retakes the highway.'],
      ['Jun 2026', 'RSF masses forces around El Obeid.'],
      ['Oct 26, 2025', 'El Fasher falls to the RSF.'],
      ['Apr 15, 2023', 'War breaks out in Khartoum.']
    ],
    sources: [
      ['The National: RSF captures El Fasher garrison', 'https://www.thenationalnews.com/news/mena/2025/10/26/sudans-rsf-says-its-fighters-have-captured-army-garrison-in-city-of-el-fashir'],
      ['EWN/AFP: RSF leader "unleashes" fighters (Jul 2026)', 'https://www.ewn.co.za/2026/07/28/sudan-rsf-leader-unleashes-fighters-after-army-gains-in-kordofan'],
      ['Sudan Tribune: clashes around El Obeid (Aug 2026)', 'https://sudantribune.com/article/317390'],
      ['AP: El Fasher takeover a "terrible escalation"', 'https://www.therepublic.com/?p=838384']
    ]
  },
  ETH: {
    leader: 'Abiy Ahmed', role: 'Prime Minister',
    gov: 'Federal parliamentary republic', lv: 3,
    summary: 'War has returned to Tigray. A TPLF-led offensive in September 2026 reignited the conflict that killed hundreds of thousands in 2020–22, and federal forces have since retaken large parts of the region, including the capital Mekelle. Ethiopia has cut ties with Eritrea, which it accuses of backing the rebels.',
    issues: [
      { t: 'Tigray', s: 'Active', d: 'The 2020–22 Tigray War ended with the Pretoria agreement, but the TPLF was banned as a party in 2025 and tensions grew. On October 16, 2026, Abiy named a six-month caretaker government for the region and promised elections. About 750,000 Tigrayans were still displaced even before the new fighting.' },
      { t: 'Eritrea and the Red Sea', s: 'High tension', d: 'Abiy calls sea access an existential need for landlocked Ethiopia, which Eritrea reads as a threat to its ports. Addis Ababa also accuses Egypt and Sudan of supporting the rebels. All three deny it.' },
      { t: 'Amhara insurgency', s: 'Ongoing', d: 'Fano militias have fought federal forces in Amhara since 2023. Voting did not take place in Tigray or in parts of Amhara in the June election.' },
      { t: 'June 2026 election', s: 'Held', d: 'Abiy’s Prosperity Party won a large parliamentary majority, reported at 438 seats.' }
    ],
    timeline: [
      ['Oct 16, 2026', 'Abiy names a caretaker government for Tigray.'],
      ['Sep 2026', 'TPLF-led offensive restarts the Tigray war.'],
      ['Jun 1, 2026', 'General election; Prosperity Party wins a large majority.'],
      ['Nov 2022', 'Pretoria agreement ends the first Tigray war.']
    ],
    sources: [
      ['Daily Maverick/Reuters: Abiy names new Tigray government', 'https://www.dailymaverick.co.za/article/2026-10-16-ethiopias-abiy-names-new-tigray-government-wants-polls-in-six-months/'],
      ['Chatham House: Ethiopia needs more than an election', 'https://www.chathamhouse.org/2026/05/ethiopia-needs-more-election-calm-internal-and-regional-conflict'],
      ['Dawan Africa: Prosperity Party wins 438 seats', 'https://www.dawan.africa/news/prosperity-party-wins-438-seats-in-ethiopias-parliament']
    ]
  },
  ERI: {
    leader: 'Isaias Afwerki', role: 'President since 1993',
    gov: 'One-party state with no national elections', lv: 2,
    summary: 'Eritrea is at the center of a new Horn of Africa standoff. Ethiopia severed ties after war resumed in Tigray, accusing Asmara of backing the TPLF, which Eritrea denies.',
    issues: [
      { t: 'Ethiopia', s: 'Ties cut', d: 'Eritrean troops fought alongside Ethiopia in the 2020–22 Tigray war, but relations collapsed over Abiy’s push for Red Sea access, which Eritrea sees as an implicit threat of force.' },
      { t: 'Regional camps', s: 'Watch', d: 'Analysts describe rival blocs forming, with the UAE backing Ethiopia and Egypt backing Eritrea.' }
    ],
    timeline: [
      ['Oct 2026', 'Ethiopia severs ties, accusing Eritrea of backing the TPLF.']
    ],
    sources: [
      ['Daily Maverick/Reuters: Abiy names new Tigray government', 'https://www.dailymaverick.co.za/article/2026-10-16-ethiopias-abiy-names-new-tigray-government-wants-polls-in-six-months/'],
      ['DW News via Pulse: New war looming in the Horn of Africa?', 'https://www.pulse.bot/defense/video/new-war-looming-in-the-horn-of-africa-dw-news-0308a1da-9e8d-4f9e-9453-ee0b63d9b67b/']
    ]
  },
  COD: {
    name: 'DR Congo',
    leader: 'Félix Tshisekedi', role: 'President',
    gov: 'Semi-presidential republic', lv: 3,
    summary: 'Eastern Congo is at war with the M23 rebel group, which the UN and Western governments say is backed by Rwanda. M23 seized Goma and Bukavu in early 2025 and runs its own administration there. Several peace deals have been signed, but fighting continues.',
    issues: [
      { t: 'M23 rebellion', s: 'Active', d: 'M23 holds the east’s two largest cities. A Doha framework deal and a ceasefire followed, and in April 2026 both sides agreed in Switzerland to ease aid deliveries and free prisoners, yet clashes go on.' },
      { t: 'Congo–Rwanda deal', s: 'Fragile', d: 'Tshisekedi and Rwanda’s Paul Kagame signed a US-brokered peace deal in Washington in December 2025. Rwanda denies backing M23, and Kinshasa wants Rwandan troops withdrawn.' },
      { t: 'Minerals', s: 'Ongoing', d: 'Congo’s mineral wealth fuels the conflict, and critics say the US deal is tied to American access to those resources.' }
    ],
    timeline: [
      ['Apr 19, 2026', 'Government and M23 agree to ease aid and release prisoners.'],
      ['Feb 2026', 'Congo agrees to a ceasefire with M23.'],
      ['Dec 4, 2025', 'Tshisekedi and Kagame sign the Washington deal.'],
      ['Jan–Feb 2025', 'M23 captures Goma and Bukavu.']
    ],
    sources: [
      ['The Standard/AFP: agreement on aid and prisoners', 'https://www.standardmedia.co.ke/sports/amp/africa/2001545770/dr-congo-m23-armed-group-agree-to-ease-aid-free-prisoners'],
      ['NPR: Congo and Rwanda sign deal as fighting rages', 'https://www.wusf.org/2025-12-04/congo-and-rwanda-to-sign-symbolic-peace-deal-in-washington-as-fighting-rages'],
      ['TRT Afrika: Congo agrees ceasefire with M23', 'https://www.trtafrika.com/article/ef4448bfa4e6']
    ]
  },
  RWA: {
    leader: 'Paul Kagame', role: 'President',
    gov: 'Presidential republic', lv: 2,
    summary: 'Rwanda is accused by the UN, Congo and Western governments of backing the M23 rebels in eastern Congo with troops and weapons, which it denies.',
    issues: [
      { t: 'Eastern Congo', s: 'Disputed', d: 'Kagame signed a US-brokered peace deal with Congo in Washington in December 2025, but implementation depends on separate Congo–M23 talks that keep stalling.' }
    ],
    timeline: [
      ['Dec 4, 2025', 'Washington peace deal with Congo.']
    ],
    sources: [
      ['NPR: Congo and Rwanda sign deal as fighting rages', 'https://www.wusf.org/2025-12-04/congo-and-rwanda-to-sign-symbolic-peace-deal-in-washington-as-fighting-rages']
    ]
  },
  CHN: {
    leader: 'Xi Jinping', role: 'President and Communist Party leader',
    gov: 'One-party state', lv: 2,
    summary: 'China claims Taiwan and has stepped up military pressure on the island, while managing a long rivalry with the US over trade, technology and the western Pacific.',
    issues: [
      { t: 'Taiwan', s: 'High tension', d: 'In late December 2025 China held its largest drills yet by area and the closest yet to Taiwan, firing rockets toward the island. Large drills paused when the Iran war began and resumed in March 2026.' },
      { t: 'Rivalry with the US', s: 'Ongoing', d: 'Tariffs, chip export controls and naval activity in the South China Sea keep relations tense.' },
      { t: 'Partners', s: 'Ongoing', d: 'Beijing is Russia’s main economic lifeline and a major buyer of Iranian oil.' }
    ],
    timeline: [
      ['Mar 14–15, 2026', 'Large-scale drills around Taiwan resume.'],
      ['Dec 29–30, 2025', '"Justice Mission 2025" drills around Taiwan.']
    ],
    sources: [
      ['Reuters via Citizen Digital: Taiwan vows to defend sovereignty', 'https://www.citizen.digital/article/taiwan-vows-to-defend-sovereignty-after-chinas-military-drill-n375148'],
      ['California Insider: China restarts drills (Mar 2026)', 'https://californiainsider.com/news/china-restarts-large-scale-military-drills-around-taiwan-after-sudden-hiaitus-5999039']
    ]
  },
  TWN: {
    leader: 'Lai Ching-te', role: 'President',
    gov: 'Democratic republic (Republic of China)', lv: 2,
    summary: 'Taiwan governs itself as a democracy but is claimed by Beijing, which has not ruled out force. Lai called 2026 a crucial year for the island and is raising defence spending.',
    issues: [
      { t: 'Chinese military pressure', s: 'High tension', d: 'Drills in late December 2025 forced dozens of domestic flights to be cancelled. China said for the first time that its exercises aimed to deter outside intervention.' },
      { t: 'Defence buildup', s: 'Ongoing', d: 'Lai wants defence spending above 3% of GDP in 2026 and 5% by 2030. The US approved a record US$11.1 billion arms package in December 2025.' },
      { t: 'Divided government', s: 'Watch', d: 'The opposition controls the legislature, which has slowed parts of Lai’s agenda.' }
    ],
    timeline: [
      ['Mar 2026', 'Chinese drills resume after a pause.'],
      ['Jan 1, 2026', 'Lai vows to defend Taiwan’s sovereignty.'],
      ['Dec 2025', 'Record US arms package, then major Chinese drills.']
    ],
    sources: [
      ['Reuters via Citizen Digital: Taiwan vows to defend sovereignty', 'https://www.citizen.digital/article/taiwan-vows-to-defend-sovereignty-after-chinas-military-drill-n375148'],
      ['The Sun: Lai’s defence spending targets', 'https://thesun.my/news/world-news/taiwans-president-vows-to-defend-sovereignty/']
    ]
  },
  IND: {
    leader: 'Narendra Modi', role: 'Prime Minister',
    gov: 'Federal parliamentary republic', lv: 2,
    summary: 'India’s rivalry with Pakistan over Kashmir flared into the worst fighting in decades in May 2025. A ceasefire has held since, but relations remain frozen.',
    issues: [
      { t: 'Kashmir and Pakistan', s: 'Frozen', d: 'After militants killed 26 people, mostly Hindu tourists, at Pahalgam on April 22, 2025, India launched Operation Sindoor on May 7. Missile, drone and artillery exchanges killed more than 70 people before a ceasefire on May 10.' },
      { t: 'Indus waters', s: 'Disputed', d: 'India put the 1960 Indus Waters Treaty on hold after Pahalgam, a serious worry for Pakistan’s farms.' },
      { t: 'Border incidents', s: 'Watch', d: 'Drone incursions were reported along the Line of Control in January 2026.' }
    ],
    timeline: [
      ['Jan 2026', 'Drone incursions reported along the Line of Control.'],
      ['May 10, 2025', 'India–Pakistan ceasefire.'],
      ['May 7, 2025', 'Operation Sindoor strikes.'],
      ['Apr 22, 2025', 'Pahalgam attack kills 26.']
    ],
    sources: [
      ['Khaleej Times: One year on from Pahalgam', 'https://www.khaleejtimes.com/world/asia/india-pakistan-kashmir-pahalgam-attack-anniversary'],
      ['Outlook India: 19 days to the edge', 'https://www.outlookindia.com/national/from-pahalgam-to-operation-sindoor-19-days-that-brought-india-pakistan-to-the-edge']
    ]
  },
  PAK: {
    leader: 'Shehbaz Sharif', role: 'Prime Minister',
    second: ['Army chief', 'Field Marshal Asim Munir'],
    gov: 'Federal parliamentary republic with a powerful military', lv: 2,
    summary: 'Pakistan faces hostile borders with both India and Afghanistan, but gained diplomatic weight in 2026 by helping broker the US–Iran ceasefire and hosting talks in Islamabad.',
    issues: [
      { t: 'India', s: 'Frozen', d: 'Relations have been frozen since the May 2025 fighting over Kashmir, and India has suspended the Indus Waters Treaty.' },
      { t: 'Afghanistan border', s: 'Clashes', d: 'Pakistan accuses the Taliban government of sheltering militants. Cross-border fighting flared again in February 2026, and the frontier has repeatedly closed.' },
      { t: 'Mediator', s: 'Active', d: 'Pakistan helped broker the April 2026 US–Iran ceasefire and hosted the Islamabad talks that followed.' }
    ],
    timeline: [
      ['Apr 12, 2026', 'US–Iran talks in Islamabad end without a deal.'],
      ['Apr 8, 2026', 'Sharif announces the US–Iran ceasefire.'],
      ['Feb 26, 2026', 'Border clashes with Afghanistan.']
    ],
    sources: [
      ['Qatar Tribune: US, Iran agree two-week truce', 'https://www.qatar-tribune.com/article/228074/world/us-iran-agree-two-week-truce'],
      ['Arab News: Pakistan responds to Afghan operations', 'https://www.arabnews.pk/node/2598186/pakistan']
    ]
  },
  VEN: {
    leader: 'Delcy Rodríguez', role: 'Acting President since January 2026',
    gov: 'Presidential republic under an interim government', lv: 2,
    summary: 'US forces seized Nicolás Maduro in a night raid on Caracas on January 3, 2026. His vice-president, Delcy Rodríguez, took over and governs in an uneasy arrangement with Washington, which has moved to control the country’s oil.',
    issues: [
      { t: 'US intervention', s: 'Ongoing', d: 'Maduro is detained in New York. Trump said the US would run Venezuela before backing Rodríguez, who has alternately cooperated with and rebuked Washington.' },
      { t: 'Elections', s: 'No date', d: 'Rodríguez told the UN in September 2026 that elections would come at the right moment, without setting a date. Opposition leader María Corina Machado has met Trump.' },
      { t: 'Essequibo', s: 'Disputed', d: 'Venezuela claims Guyana’s oil-rich Essequibo region.' }
    ],
    timeline: [
      ['Sep 23, 2026', 'Rodríguez addresses the UN General Assembly.'],
      ['Jan 5, 2026', 'Rodríguez sworn in as acting president.'],
      ['Jan 3, 2026', 'US raid captures Maduro.']
    ],
    sources: [
      ['Philadelphia Inquirer: Who is Delcy Rodríguez?', 'https://www.inquirer.com/news/nation-world/delcy-rodriguez-venezuela-interm-president-20260105.html'],
      ['GPB/NPR: elections "at the right moment"', 'https://www.gpb.org/news/2026/09/24/venezuelas-acting-leader-promises-elections-at-the-right-moment'],
      ['Fox News: Rodríguez rebukes Washington', 'https://www.foxnews.com/politics/venezuelas-delcy-rodriguez-snaps-washington-declares-enough-us-influence.amp']
    ]
  },
  MMR: {
    name: 'Myanmar',
    leader: 'Min Aung Hlaing', role: 'President since April 2026',
    gov: 'Military-dominated government after a junta-run election', lv: 3,
    summary: 'Myanmar has been in civil war since the 2021 coup that ousted Aung San Suu Kyi’s elected government. Coup leader Min Aung Hlaing became president in April 2026 after an election run by his own junta, keeping the army in charge.',
    issues: [
      { t: 'Civil war', s: 'Active', d: 'Pro-democracy resistance forces and ethnic armed groups fight the military across much of the country, especially in the borderlands.' },
      { t: 'Army-run transition', s: 'Contested', d: 'Parliament, dominated by the army-backed USDP and appointed military members, elected him with 429 of 584 votes. He handed command of the military to former intelligence chief Ye Win Oo.' }
    ],
    timeline: [
      ['Apr 10, 2026', 'Min Aung Hlaing sworn in as president.'],
      ['Apr 3, 2026', 'Elected president by parliament.'],
      ['Feb 1, 2021', 'Military coup.']
    ],
    sources: [
      ['Chronicle.lu/Reuters: junta chief elected president', 'https://chronicle.lu/category/international-news/60465-myanmar-junta-chief-min-aung-hlaing-elected-president-by-pro-military-parliament'],
      ['The Star/AP: parliament elects ruling general', 'https://www.thestar.com.my/aseanplus/aseanplus-news/2026/04/05/039i039m-the-boss-now039-myanmars-parliament-elects-the-ruling-general-as-president-keeping-the-army-firmly-in-charge']
    ]
  },
  SYR: {
    leader: 'Ahmed al-Sharaa', role: 'Transitional President',
    gov: 'Transitional government', lv: 2,
    summary: 'Syria is rebuilding after Bashar al-Assad fell in December 2024 to an offensive led by al-Sharaa’s group, HTS. He has won sanctions relief and international recognition but faces sectarian violence, disputes with Kurdish forces and Israeli strikes.',
    issues: [
      { t: 'Kurdish northeast', s: 'Truce', d: 'Government forces clashed with the Kurdish-led SDF in Aleppo and the northeast in January 2026 before a truce.' },
      { t: 'Foreign forces', s: 'Shifting', d: 'The US began pulling troops out in February 2026 as Damascus took over the fight against the Islamic State. Israel has carried out raids and strikes in southern Syria.' },
      { t: 'Justice and reform', s: 'Underway', d: 'The first trial of Assad-era officials opened in April 2026, and al-Sharaa reshuffled his cabinet in May.' }
    ],
    timeline: [
      ['May 9, 2026', 'First cabinet reshuffle since Assad’s fall.'],
      ['Apr 26, 2026', 'First trial of Assad-era officials begins.'],
      ['Feb 18, 2026', 'US begins withdrawing forces.'],
      ['Jan 2026', 'Clashes with the SDF in Aleppo and the northeast.'],
      ['Dec 8, 2024', 'Assad government collapses.']
    ],
    sources: [
      ['Arab News: Syria’s first cabinet reshuffle', 'https://www.arabnews.pk/node/2642981'],
      ['SCMP: US pulls forces from Syria', 'https://www.scmp.com/news/world/middle-east/article/3343947/us-pulls-forces-syria-new-government-exerts-control'],
      ['SCMP: Syria begins trial of Assad-era officials', 'https://www.scmp.com/news/world/middle-east/article/3351488/syria-begins-long-awaited-first-trial-assad-era-officials']
    ]
  }
};

/* tier: 1 = Major, 2 = Notable, 3 = All. `hub` is where the main arc lands; `br` names places it then branches to. */
export const LINKS = [
  { a: 'RUS', b: 'UKR', type: 'conflict', tier: 1, label: 'Russia–Ukraine war', hub: [49.0, 35.4],
    br: [['UKR', 'Donetsk front'], ['UKR', 'Kupiansk'], ['UKR', 'Zaporizhzhia front'], ['UKR', 'Kyiv']],
    d: 'Russia launched its full-scale invasion in February 2022 and occupies about a fifth of Ukraine. Fighting is concentrated in the east and south, and both sides carry out long-range strikes.',
    src: [['ISW, Oct 21, 2026', 'https://www.criticalthreats.org/analysis/russian-offensive-campaign-assessment-october-21-2026']] },
  { a: 'ISR', b: 'PSE', type: 'conflict', tier: 1, label: 'Gaza war, now a fragile ceasefire',
    br: [['PSE', 'Gaza City'], ['PSE', 'Rafah pilot zone']],
    d: 'The war began after the Hamas-led attack of October 7, 2023. A ceasefire has held shakily since October 10, 2025, with Israeli strikes continuing and Hamas disarmament stalled.',
    src: [['Euronews, May 2026', 'https://www.euronews.com/2026/05/20/hamas-to-blame-for-lack-of-progress-on-phase-two-of-ceasefire-board-of-peace-report-says']] },
  { a: 'USA', b: 'IRN', type: 'conflict', tier: 1, label: '2026 Iran war',
    br: [['IRN', 'Tehran'], ['IRN', 'Strait of Hormuz'], ['IRN', 'Fordow'], ['IRN', 'Natanz']],
    d: 'US and Israeli strikes from February 28, 2026 killed Iran’s Supreme Leader. Truces and an interim deal in June followed, but clashes resumed in July and access to the Strait of Hormuz is still being negotiated.',
    src: [['TradeWinds, Jun 2026', 'https://www.tradewindsnews.com/tankers/us-iran-deal-signed-confirms-hormuz-opening-within-30-days-no-tolls-for-60/2-1-2005708'], ['Oman Observer, Sep 2026', 'https://www.omanobserver.om/article/1194118/world/region/oman-iran-deal-on-hormuz-expected-soon-us-iran-officials']] },
  { a: 'ISR', b: 'IRN', type: 'conflict', tier: 1, label: 'Israel–Iran wars',
    br: [['IRN', 'Tehran'], ['IRN', 'Fordow'], ['IRN', 'Natanz']],
    d: 'Israel fought a 12-day war with Iran in June 2025, then struck Iran again alongside the US from February 2026. Iran fired missiles at Israel in both rounds.',
    src: [['WUSF/NPR, Feb 28, 2026', 'https://www.wusf.org/2026-02-28/white-house-confirms-death-of-irans-supreme-leader-ayatollah-ali-khamenei']] },
  { a: 'USA', b: 'VEN', type: 'conflict', tier: 1, label: 'US raid that captured Maduro',
    br: [['VEN', 'Caracas']],
    d: 'US forces captured Nicolás Maduro in Caracas on January 3, 2026. Washington now works with acting president Delcy Rodríguez and has moved to take control of Venezuela’s oil.',
    src: [['Philadelphia Inquirer, Jan 2026', 'https://www.inquirer.com/news/nation-world/delcy-rodriguez-venezuela-interm-president-20260105.html']] },
  { a: 'RWA', b: 'COD', type: 'dispute', tier: 1, label: 'M23 rebellion in eastern Congo', hub: [-1.6, 28.4],
    br: [['COD', 'Goma'], ['COD', 'Bukavu']],
    d: 'The UN and Western governments say Rwanda backs the M23 rebels, who hold Goma and Bukavu. Rwanda denies it. The two governments signed a US-brokered deal in December 2025, but fighting continues.',
    src: [['NPR, Dec 2025', 'https://www.wusf.org/2025-12-04/congo-and-rwanda-to-sign-symbolic-peace-deal-in-washington-as-fighting-rages']] },
  { a: 'ETH', b: 'ERI', type: 'dispute', tier: 1, label: 'Ties cut over Tigray and Red Sea access',
    br: [['ERI', 'Asmara'], ['ERI', 'Assab']],
    d: 'Allies during the 2020–22 Tigray war, the two fell out over Ethiopia’s push for Red Sea access. Ethiopia cut ties in October 2026, accusing Eritrea of backing the TPLF, which Eritrea denies.',
    src: [['Daily Maverick/Reuters, Oct 2026', 'https://www.dailymaverick.co.za/article/2026-10-16-ethiopias-abiy-names-new-tigray-government-wants-polls-in-six-months/']] },
  { a: 'EGY', b: 'ETH', type: 'dispute', tier: 1, label: 'Nile dam; accused of backing rebels',
    d: 'Egypt opposes Ethiopia’s giant dam on the Blue Nile, and Ethiopia accuses Egypt of supporting the Tigrayan rebels, which Egypt denies.',
    src: [['Daily Maverick/Reuters, Oct 2026', 'https://www.dailymaverick.co.za/article/2026-10-16-ethiopias-abiy-names-new-tigray-government-wants-polls-in-six-months/']] },
  { a: 'CHN', b: 'TWN', type: 'dispute', tier: 1, label: 'Beijing claims Taiwan',
    br: [['TWN', 'Taiwan Strait'], ['TWN', 'Taipei']],
    d: 'China claims Taiwan and has not ruled out force. Its December 2025 drills were the largest yet by area and the closest yet to the island.',
    src: [['Reuters via Citizen Digital, Jan 2026', 'https://www.citizen.digital/article/taiwan-vows-to-defend-sovereignty-after-chinas-military-drill-n375148']] },
  { a: 'IND', b: 'PAK', type: 'dispute', tier: 1, label: 'Kashmir', hub: [34.2, 74.6], both: true,
    br: [['IND', 'Line of Control'], ['IND', 'Pahalgam']],
    d: 'Both claim Kashmir in full. After the Pahalgam attack in April 2025, fighting in May killed more than 70 people before a ceasefire. Relations remain frozen.',
    src: [['Khaleej Times, Apr 2026', 'https://www.khaleejtimes.com/world/asia/india-pakistan-kashmir-pahalgam-attack-anniversary']] },
  { a: 'PAK', b: 'AFG', type: 'dispute', tier: 1, label: 'Border clashes', hub: [34.13, 71.09],
    br: [['PAK', 'Torkham crossing']],
    d: 'Pakistan accuses Afghanistan’s Taliban government of sheltering militants. Border fighting flared again in February 2026, and the frontier has repeatedly closed.',
    src: [['Arab News, Feb 2026', 'https://www.arabnews.pk/node/2598186/pakistan']] },
  { a: 'VEN', b: 'GUY', type: 'dispute', tier: 1, label: 'Essequibo claim',
    br: [['VEN', 'Essequibo']],
    d: 'Venezuela claims Guyana’s oil-rich Essequibo region, about two-thirds of Guyana’s territory.',
    src: [] },
  { a: 'USA', b: 'TWN', type: 'alliance', tier: 1, label: 'Arms sales and security ties',
    d: 'The US approved a record US$11.1 billion arms package for Taiwan in December 2025. China responded with major drills days later.',
    src: [['The Jakarta Post/Reuters, Jan 2026', 'https://www.thejakartapost.com/world/2026/01/01/taiwan-vows-to-defend-sovereignty-after-chinas-military-drill']] },
  { a: 'USA', b: 'ISR', type: 'alliance', tier: 1, label: 'Joint strikes on Iran',
    d: 'Israel’s closest ally. The two launched joint strikes on Iran in February 2026, and Trump’s plan underpins the Gaza ceasefire.',
    src: [['WUSF/NPR, Feb 28, 2026', 'https://www.wusf.org/2026-02-28/white-house-confirms-death-of-irans-supreme-leader-ayatollah-ali-khamenei']] },
  { a: 'RUS', b: 'CHN', type: 'alliance', tier: 1, label: 'Strategic partnership',
    d: 'China is Russia’s main economic lifeline under Western sanctions, buying its oil and supplying goods for its war economy.', src: [] },
  { a: 'RUS', b: 'IRN', type: 'alliance', tier: 1, label: 'Military cooperation',
    d: 'Iran has supplied Russia with attack drones for its war in Ukraine, and the two cooperate against Western sanctions.', src: [] },
  { a: 'ARE', b: 'ETH', type: 'alliance', tier: 1, label: 'Gulf backer of Addis Ababa',
    d: 'Analysts describe the UAE as Ethiopia’s principal foreign ally in the Horn of Africa rivalry.',
    src: [['DW News, May 2026', 'https://www.pulse.bot/defense/video/new-war-looming-in-the-horn-of-africa-dw-news-0308a1da-9e8d-4f9e-9453-ee0b63d9b67b/']] },
  { a: 'EGY', b: 'ERI', type: 'alliance', tier: 1, label: 'Counterweight to Ethiopia',
    d: 'Egypt backs Eritrea, forming a rival camp to Ethiopia and the UAE.',
    src: [['DW News, May 2026', 'https://www.pulse.bot/defense/video/new-war-looming-in-the-horn-of-africa-dw-news-0308a1da-9e8d-4f9e-9453-ee0b63d9b67b/']] },

  /* ---- Notable (2) ---- */
  { a: 'ISR', b: 'LBN', type: 'conflict', tier: 2, label: 'Hezbollah front', hub: [33.1, 35.5],
    br: [['ISR', 'Lebanon border']],
    d: 'Israel and Hezbollah fought across the border during the Iran war. The April 2026 US–Iran truce was extended to Lebanon, and Israel later authorized direct talks with Beirut.',
    src: [['Qatar Tribune, Apr 2026', 'https://www.qatar-tribune.com/article/228074/world/us-iran-agree-two-week-truce']] },
  { a: 'PRK', b: 'RUS', type: 'alliance', tier: 2, label: 'Troops for Russia’s war', hub: [51.73, 36.19],
    d: 'North Korea has sent troops and munitions to Russia. Nearly 11,000 North Korean soldiers were reported in Russia’s Kursk region at the start of 2026.',
    src: [['Kyiv Independent, Jan 2026', 'https://kyivindependent.com/nearly-11-000-north-korean-troops-stationed-in-russias-kursk-oblast-at-start-of-2026-media-reports/']] },
  { a: 'ISR', b: 'SYR', type: 'dispute', tier: 2, label: 'Raids in southern Syria',
    br: [['SYR', 'Quneitra']],
    d: 'Israel has carried out raids and strikes in southern Syria since Assad’s fall, even as the new government seeks recognition.',
    src: [['Morning Star, Syria coverage', 'https://morningstaronline.co.uk/tags/Syria?page=8']] },
  { a: 'USA', b: 'CHN', type: 'dispute', tier: 2, label: 'Great-power rivalry',
    d: 'Tariffs, chip export controls, Taiwan and naval activity in the South China Sea keep relations tense.', src: [] },

  { a: 'PRK', b: 'KOR', type: 'dispute', tier: 2, label: 'Korean standoff', hub: [38.0, 127.0], both: true,
    d: 'The 1950–53 Korean War ended in an armistice, not a peace treaty, so the two Koreas are technically still at war across the heavily fortified Demilitarized Zone. North Korea keeps expanding its nuclear and missile programs.', src: [] },
  { a: 'CHN', b: 'PHL', type: 'dispute', tier: 2, label: 'South China Sea', hub: [15.15, 117.76],
    d: 'China claims most of the South China Sea despite a 2016 international ruling against it. Its coast guard and navy patrol around Scarborough Shoal, and the Philippines has accused Chinese vessels of water-cannon attacks on its ships.',
    src: [['gCaptain: China patrols around Scarborough Shoal', 'https://gcaptain.com/china-conducts-patrols-around-scarborough-shoal-in-disputed-south-china-sea/'], ['The Vibes: second water cannon attack', 'https://www.thevibes.com/articles/world/125397/philippines-accuses-china-of-second-water-cannon-attack-as-south-china-sea-tensions-escalate']] },
  { a: 'YEM', b: 'SAU', type: 'conflict', tier: 2, label: 'Houthi attacks in the Red Sea', hub: [15.5, 41.6],
    d: 'Yemen’s Iran-backed Houthi movement, which controls the capital Sanaa, escalated attacks on Red Sea shipping and on Saudi Arabia in 2026, threatening one of the world’s busiest trade routes.',
    src: [['FDD Long War Journal, Aug 2026', 'https://www.fdd.org/analysis/2026/08/06/houthis-escalate-attacks-in-red-sea-and-on-saudi-arabia-riyadh-evaluates-options/']] },
  { a: 'ARE', b: 'SDN', type: 'dispute', tier: 2, label: 'Accused of arming the RSF',
    d: 'Sudan’s army-led government accuses the UAE of arming the RSF and has cut diplomatic ties. The UAE denies supplying the paramilitary group.',
    src: [['The New Arab: Sudan cuts ties with the UAE', 'https://www.newarab.com/news/sudan-government-declares-uae-aggressor-state-cuts-ties'], ['Daily Maverick, May 2026', 'https://www.dailymaverick.co.za/article/2026-05-03-united-arab-emirates-accused-of-fuelling-conflict-as-genocide-fears-rise-in-sudan/']] },

  /* ---- Significant (3) ---- */
  { a: 'CHN', b: 'IND', type: 'dispute', tier: 3, label: 'Himalayan border', hub: [34.5, 78.3], both: true,
    d: 'The two nuclear powers dispute long stretches of their Himalayan border. A 2020 clash in Ladakh’s Galwan Valley killed soldiers on both sides, and a 2024 deal pulled troops back from some friction points.', src: [] },
  { a: 'CHN', b: 'JPN', type: 'dispute', tier: 3, label: 'Taiwan remarks and Senkaku Islands', hub: [25.75, 123.5],
    d: 'Relations broke down after Prime Minister Sanae Takaichi suggested in November 2025 that a Chinese attack on Taiwan could draw in Japan’s military. The two also dispute the Senkaku Islands, which China calls the Diaoyu.',
    src: [['CGTN, Mar 2026', 'https://news.cgtn.com/news/2026-03-25/China-says-rift-with-Japan-stems-from-Takaichi-s-Taiwan-remarks-1LNmmvCgpWg/share_amp.html'], ['The Star: why the feud could rage on', 'https://www.thestar.com.my/aseanplus/aseanplus-news/2026/01/02/why-the-feud-between-tokyo-and-beijing-could-rage-on-for-a-while-yet']] },
  { a: 'THA', b: 'KHM', type: 'dispute', tier: 3, label: 'Border clashes', hub: [14.39, 104.68], both: true,
    d: 'Deadly border fighting in 2025 ended in a US-brokered ceasefire that remains uneasy. Cambodia says Thai forces still occupy disputed land, and Thailand plans a permanent border fence.',
    src: [['Fox News: Cambodian PM on disputed land', 'https://www.foxnews.com/politics/cambodian-pm-says-thai-forces-occupying-disputed-land-despite-trump-brokered-ceasefire'], ['Pattaya Mail: border fence', 'https://www.pattayamail.com/thailandnews/thailand-to-build-permanent-border-fence-with-cambodia-pilot-section-set-for-chanthaburi-539825']] },
  { a: 'USA', b: 'GRL', type: 'dispute', tier: 3, label: 'US push for Greenland',
    d: 'Trump has repeatedly said the US should control Greenland, a self-governing part of Denmark. Talks at the White House in January 2026 ended in disagreement, and Greenland’s leaders say they choose Denmark.',
    src: [['The National, Jan 2026', 'https://www.thenationalnews.com/news/us/2026/01/14/trump-us-control-greenland-denmark'], ['Congressional Research Service, Jan 2026', 'https://www.everycrsreport.com/reports/IN12643.html']] },
  { a: 'USA', b: 'MEX', type: 'dispute', tier: 3, label: 'Tariffs and cartels',
    d: 'Washington has pressed Mexico with tariffs and demands to curb cartels and fentanyl. The killing of cartel leader "El Mencho" in a February 2026 Mexican operation set off cartel retaliation.',
    src: [['ROIC: cartel crackdown and trade tensions, Feb 2026', 'https://www.roic.ai/news/us-mexico-cartel-crackdown-intensifies-as-el-mencho-killing-sparks-retaliation-and-trade-tensions-02-23-2026']] },

  /* ---- Minor (4) ---- */
  { a: 'ARM', b: 'AZE', type: 'diplomacy', tier: 4, label: 'Peace deal initialed, not yet signed',
    d: 'After decades of conflict over Nagorno-Karabakh, which Azerbaijan retook in 2023, the two initialed a peace agreement at the White House in August 2025. It has not yet been formally signed.',
    src: [['Armenpress: Azerbaijan expects signing in 2026', 'https://armenpress.am/en/article/1236862']] },
  { a: 'SRB', b: 'KOS', type: 'dispute', tier: 4, label: 'Kosovo independence',
    d: 'Serbia does not recognize Kosovo’s 2008 declaration of independence, and tensions flare in Serb-majority northern Kosovo.', src: [] },
  { a: 'MAR', b: 'DZA', type: 'dispute', tier: 4, label: 'Western Sahara', hub: [24.5, -13.0],
    d: 'Morocco controls most of Western Sahara, while Algeria backs the Polisario Front independence movement. Algeria cut diplomatic ties with Morocco in 2021.', src: [] },
  { a: 'IRN', b: 'YEM', type: 'alliance', tier: 4, label: 'Backs the Houthis',
    d: 'Iran arms and supports Yemen’s Houthi movement as part of its network of allied armed groups.', src: [] },
  { a: 'IRN', b: 'LBN', type: 'alliance', tier: 4, label: 'Backs Hezbollah',
    d: 'Iran is the main sponsor of Hezbollah, the Lebanese armed group and political party.', src: [] },
  { a: 'RUS', b: 'BLR', type: 'alliance', tier: 4, label: 'Union State',
    d: 'Belarus is Russia’s closest ally. Its territory was used to launch the 2022 invasion of Ukraine, and Russia has stationed tactical nuclear weapons there.', src: [] },
  { a: 'USA', b: 'JPN', type: 'alliance', tier: 4, label: 'Security treaty',
    d: 'Japan hosts the largest US military presence overseas under a mutual security treaty.', src: [] },
  { a: 'USA', b: 'KOR', type: 'alliance', tier: 4, label: 'Security treaty',
    d: 'About 28,500 US troops are based in South Korea under a mutual defence treaty.', src: [] },
  { a: 'USA', b: 'PHL', type: 'alliance', tier: 4, label: 'Mutual defence treaty',
    d: 'The US says its 1951 treaty with the Philippines covers attacks on Philippine forces in the South China Sea.', src: [] },
  { a: 'USA', b: 'AUS', type: 'alliance', tier: 4, label: 'AUKUS and the Quad',
    d: 'Close allies through AUKUS, a submarine and technology pact with the UK, and the Quad grouping with India and Japan.', src: [] },
  /* ---- more Significant / Minor ---- */
  { a: 'CAN', b: 'USA', type: 'dispute', tier: 3, label: 'Trade war',
    d: 'The trade fight that began in 2025 escalated in August 2026, when the US put 50% tariffs on about US$20 billion of Canadian goods. Canada answered with counter-tariffs from September 8.',
    src: [['Osler: Section 338 tariffs and Canada’s response', 'https://www.osler.com/en/insights/updates/elbows-back-up-u-s-section-338-tariffs-canada-retaliatory-surtaxes-current-landscape/'], ['Sentisense: US imposes 50% tariffs', 'https://app.sentisense.ai/stories/us-imposes-50-percent-tariffs-on-20-billion-of-canadian-goods-canada-vows-dollar-08222026']] },
  { a: 'PAK', b: 'IRN', type: 'diplomacy', tier: 4, label: 'Mediated the US–Iran truce',
    d: 'Pakistan helped broker the April 2026 US–Iran ceasefire and hosted talks in Islamabad.',
    src: [['Qatar Tribune, Apr 2026', 'https://www.qatar-tribune.com/article/228074/world/us-iran-agree-two-week-truce']] },
  { a: 'OMN', b: 'IRN', type: 'diplomacy', tier: 4, label: 'Hormuz shipping talks', hub: [26.57, 56.25],
    d: 'Oman and Iran have been negotiating a shipping route through the Strait of Hormuz, with US backing.',
    src: [['Oman Observer, Sep 2026', 'https://www.omanobserver.om/article/1194118/world/region/oman-iran-deal-on-hormuz-expected-soon-us-iran-officials']] },
  { a: 'QAT', b: 'COD', type: 'diplomacy', tier: 4, label: 'Hosted Congo–M23 talks',
    d: 'Qatar has hosted rounds of talks between Congo’s government and the M23 rebels in Doha.',
    src: [['AP, Nov 2025', 'https://www.finedayradio.com/news/world-srn-news/congo-and-rwanda-backed-m23-rebels-sign-framework-for-peace-deal-but-tensions-remain']] },
  /* ---- Everything (5) ---- */
  { a: 'GRC', b: 'TUR', type: 'dispute', tier: 5, label: 'Aegean and Cyprus', hub: [38.5, 25.5], both: true,
    d: 'NATO allies with long-running disputes over Aegean airspace and waters and over divided Cyprus.', src: [] },
  { a: 'CHN', b: 'PAK', type: 'alliance', tier: 5, label: 'All-weather partners',
    d: 'China is Pakistan’s main arms supplier and is funding the China–Pakistan Economic Corridor.', src: [] },
  { a: 'RUS', b: 'IND', type: 'alliance', tier: 5, label: 'Arms and oil',
    d: 'India is a major buyer of Russian weapons and discounted Russian oil, which has strained its ties with Washington.', src: [] },
  { a: 'TUR', b: 'AZE', type: 'alliance', tier: 5, label: '"One nation, two states"',
    d: 'Turkey is Azerbaijan’s closest ally and supplied drones used in the Karabakh fighting.', src: [] },
  { a: 'USA', b: 'IND', type: 'alliance', tier: 5, label: 'Quad partners',
    d: 'Partners in the Quad with Japan and Australia, though trade disputes have strained ties.', src: [] },
  { a: 'GBR', b: 'UKR', type: 'alliance', tier: 5, label: 'Military aid', d: 'One of Ukraine’s largest military backers.', src: [] },
  { a: 'DEU', b: 'UKR', type: 'alliance', tier: 5, label: 'Military aid', d: 'Europe’s largest supplier of military aid to Ukraine.', src: [] },
  { a: 'FRA', b: 'UKR', type: 'alliance', tier: 5, label: 'Military aid', d: 'A leading backer of Ukraine and of European security guarantees for it.', src: [] },
  { a: 'POL', b: 'UKR', type: 'alliance', tier: 5, label: 'Supply hub', d: 'The main route for Western weapons and aid entering Ukraine.', src: [] },
  { a: 'EGY', b: 'SDN', type: 'alliance', tier: 5, label: 'Backs Sudan’s army', d: 'Egypt is widely seen as supporting Sudan’s army against the RSF.', src: [] }
];

export const HOTS = [
  { name: 'Donbas', lat: 48.0, lng: 37.8, iso: 'UKR', lv: 3, note: 'Main front line of the Russia–Ukraine war.' },
  { name: 'Gaza', lat: 31.42, lng: 34.38, iso: 'PSE', lv: 3, note: 'Fragile ceasefire since October 10, 2025.' },
  { name: 'Strait of Hormuz', lat: 26.57, lng: 56.25, iso: 'IRN', lv: 3, note: 'Oil chokepoint Iran used as leverage in the 2026 war.' },
  { name: 'El Obeid', lat: 13.18, lng: 30.22, iso: 'SDN', lv: 3, note: 'Besieged by the RSF; junction between army- and RSF-held Sudan.' },
  { name: 'El Fasher', lat: 13.63, lng: 25.35, iso: 'SDN', lv: 3, note: 'Fell to the RSF in October 2025 after an 18-month siege.' },
  { name: 'Tigray', lat: 13.5, lng: 39.47, iso: 'ETH', lv: 3, note: 'War resumed in September 2026; federal forces took Mekelle.' },
  { name: 'Goma', lat: -1.68, lng: 29.23, iso: 'COD', lv: 3, note: 'Held by M23 since January 2025.' },
  { name: 'Sagaing', lat: 22.0, lng: 95.97, iso: 'MMR', lv: 3, note: 'A heartland of the armed resistance to military rule.' },
  { name: 'Taiwan Strait', lat: 24.3, lng: 119.6, iso: 'TWN', lv: 2, note: 'Site of repeated large-scale Chinese drills.' },
  { name: 'Kashmir', lat: 34.08, lng: 74.8, iso: 'IND', lv: 2, note: 'Divided between India and Pakistan along the Line of Control.' },
  { name: 'Caracas', lat: 10.49, lng: -66.88, iso: 'VEN', lv: 2, note: 'Site of the January 2026 US raid.' }
];

/* Where each conflict happens. `ip` maps each briefing issue (by order) to a place index, or null. */
export const PLACES = {
  UKR: { ip: [0, null, 4], list: [
    { n: 'Donetsk front', lat: 48.3, lng: 37.6, lv: 3, d: 'The main battlefield, where Russian forces make slow, costly advances.' },
    { n: 'Kupiansk', lat: 49.71, lng: 37.62, lv: 3, d: 'Target of a Russian offensive in 2026.' },
    { n: 'Zaporizhzhia front', lat: 47.58, lng: 35.78, lv: 3, d: 'Southern front near Mala Tokmachka, another 2026 Russian push.' },
    { n: 'Crimea', lat: 45.0, lng: 34.1, lv: 2, d: 'Annexed by Russia in 2014.' },
    { n: 'Kyiv', lat: 50.45, lng: 30.52, lv: 3, d: 'Hit by Russian missiles and drones, including a ballistic missile attack on October 19, 2026.' }
  ] },
  RUS: { ip: [1, null, null], list: [
    { n: 'Moscow', lat: 55.75, lng: 37.62, lv: 2, d: 'The Kremlin rejected a freeze along current lines in October 2026.' },
    { n: 'Donetsk front', lat: 48.3, lng: 37.6, lv: 3, d: 'Occupied Ukrainian territory where Russian forces keep attacking.' },
    { n: 'Crimea', lat: 45.0, lng: 34.1, lv: 2, d: 'Ukrainian peninsula Russia annexed in 2014.' }
  ] },
  ISR: { ip: [0, 1, 2], list: [
    { n: 'Jerusalem', lat: 31.78, lng: 35.22, lv: 2, d: 'Seat of the Knesset, where coalition talks follow the October 27 vote.' },
    { n: 'Gaza', lat: 31.42, lng: 34.38, lv: 3, d: 'Fragile ceasefire since October 10, 2025.' },
    { n: 'Lebanon border', lat: 33.1, lng: 35.5, lv: 2, d: 'Front with Hezbollah, covered by the April 2026 truce.' }
  ] },
  PSE: { ip: [1, 0, 2], list: [
    { n: 'Gaza City', lat: 31.52, lng: 34.45, lv: 3, d: 'Gaza’s largest city, heavily damaged in the war.' },
    { n: 'Rafah pilot zone', lat: 31.29, lng: 34.25, lv: 2, d: 'Planned Board of Peace civilian zone at Tel Sultan.' },
    { n: 'Ramallah', lat: 31.9, lng: 35.2, lv: 2, d: 'Seat of the Palestinian Authority in the West Bank.' }
  ] },
  IRN: { ip: [0, 1, 0], list: [
    { n: 'Tehran', lat: 35.69, lng: 51.39, lv: 3, d: 'Strikes on February 28, 2026 destroyed the Supreme Leader’s compound, killing Ali Khamenei. Also the center of the 2026 protests.' },
    { n: 'Strait of Hormuz', lat: 26.57, lng: 56.25, lv: 3, d: 'Oil chokepoint Iran has used as its main leverage.' },
    { n: 'Fordow', lat: 34.88, lng: 50.99, lv: 2, d: 'Underground enrichment site bombed by the US in June 2025.' },
    { n: 'Natanz', lat: 33.72, lng: 51.73, lv: 2, d: 'Iran’s main enrichment site, also struck in June 2025.' }
  ] },
  USA: { ip: [2, 1, 0, 3], list: [
    { n: 'Washington', lat: 38.9, lng: -77.04, lv: 1, d: 'Host of Board of Peace meetings and the December 2025 Congo–Rwanda signing.' },
    { n: 'Caracas', lat: 10.49, lng: -66.88, lv: 2, d: 'US raid captured Maduro here on January 3, 2026.' },
    { n: 'Strait of Hormuz', lat: 26.57, lng: 56.25, lv: 3, d: 'Focus of the US–Iran standoff and blockade.' },
    { n: 'Taiwan Strait', lat: 24.3, lng: 119.6, lv: 2, d: 'Where China stages drills after US arms sales.' }
  ] },
  SDN: { ip: [0, 1, null], list: [
    { n: 'El Fasher', lat: 13.63, lng: 25.35, lv: 3, d: 'Fell to the RSF on October 26, 2025 after an 18-month siege.' },
    { n: 'El Obeid', lat: 13.18, lng: 30.22, lv: 3, d: 'Besieged by the RSF; heavy fighting around the city in mid-2026.' },
    { n: 'Khartoum', lat: 15.5, lng: 32.56, lv: 2, d: 'War broke out here in April 2023; the army retook the capital in 2025.' }
  ] },
  ETH: { ip: [0, 1, 2, 3], list: [
    { n: 'Mekelle', lat: 13.5, lng: 39.47, lv: 3, d: 'Tigray’s capital, retaken by federal forces in the new fighting.' },
    { n: 'Assab', lat: 13.01, lng: 42.74, lv: 2, d: 'Eritrean Red Sea port often named in Ethiopia’s push for sea access.' },
    { n: 'Bahir Dar', lat: 11.59, lng: 37.39, lv: 3, d: 'Capital of Amhara, where Fano militias fight federal forces.' },
    { n: 'Addis Ababa', lat: 9.03, lng: 38.74, lv: 1, d: 'Federal capital.' }
  ] },
  ERI: { ip: [0, null], list: [
    { n: 'Asmara', lat: 15.33, lng: 38.93, lv: 2, d: 'Capital. Ethiopia accuses it of backing the TPLF.' },
    { n: 'Assab', lat: 13.01, lng: 42.74, lv: 2, d: 'Red Sea port at the center of Ethiopia’s sea-access claims.' }
  ] },
  COD: { ip: [0, null, null], list: [
    { n: 'Goma', lat: -1.68, lng: 29.23, lv: 3, d: 'Held by M23 since January 2025.' },
    { n: 'Bukavu', lat: -2.51, lng: 28.86, lv: 3, d: 'Taken by M23 in February 2025.' },
    { n: 'Kinshasa', lat: -4.32, lng: 15.31, lv: 1, d: 'Capital, about 1,500 km west of the fighting.' }
  ] },
  RWA: { ip: [1], list: [
    { n: 'Kigali', lat: -1.95, lng: 30.06, lv: 1, d: 'Capital.' },
    { n: 'Goma', lat: -1.68, lng: 29.23, lv: 3, d: 'M23-held Congolese city on the Rwandan border.' }
  ] },
  CHN: { ip: [1, 2, null], list: [
    { n: 'Beijing', lat: 39.9, lng: 116.4, lv: 1, d: 'Seat of government.' },
    { n: 'Taiwan Strait', lat: 24.3, lng: 119.6, lv: 2, d: 'Site of repeated large-scale drills.' },
    { n: 'South China Sea', lat: 12.0, lng: 114.0, lv: 2, d: 'Contested waters where Chinese and US-allied ships often face off.' }
  ] },
  TWN: { ip: [1, 0, 0], list: [
    { n: 'Taipei', lat: 25.03, lng: 121.56, lv: 1, d: 'Capital.' },
    { n: 'Taiwan Strait', lat: 24.3, lng: 119.6, lv: 2, d: 'Where Chinese drills fired rockets toward the island in December 2025.' }
  ] },
  IND: { ip: [0, null, 1], list: [
    { n: 'Pahalgam', lat: 34.01, lng: 75.32, lv: 2, d: 'Site of the April 2025 attack that killed 26.' },
    { n: 'Line of Control', lat: 34.35, lng: 74.0, lv: 2, d: 'De facto border dividing Kashmir between India and Pakistan.' },
    { n: 'New Delhi', lat: 28.61, lng: 77.21, lv: 1, d: 'Capital.' }
  ] },
  PAK: { ip: [2, 1, 0], list: [
    { n: 'Islamabad', lat: 33.69, lng: 73.06, lv: 1, d: 'Hosted US–Iran talks in April 2026.' },
    { n: 'Torkham crossing', lat: 34.13, lng: 71.09, lv: 2, d: 'Main crossing on the often-closed Afghan frontier.' },
    { n: 'Line of Control', lat: 34.35, lng: 74.0, lv: 2, d: 'De facto border dividing Kashmir.' }
  ] },
  VEN: { ip: [0, null, 1], list: [
    { n: 'Caracas', lat: 10.49, lng: -66.88, lv: 2, d: 'US raid captured Maduro here on January 3, 2026.' },
    { n: 'Essequibo', lat: 6.5, lng: -59.0, lv: 2, d: 'Guyanese region that Venezuela claims.' }
  ] },
  MMR: { ip: [1, 0], list: [
    { n: 'Naypyidaw', lat: 19.76, lng: 96.13, lv: 1, d: 'Capital, where parliament elected Min Aung Hlaing.' },
    { n: 'Sagaing', lat: 22.0, lng: 95.97, lv: 3, d: 'A heartland of the armed resistance.' }
  ] },
  SYR: { ip: [1, 3, 0], list: [
    { n: 'Damascus', lat: 33.51, lng: 36.29, lv: 1, d: 'Capital and seat of the transitional government.' },
    { n: 'Aleppo', lat: 36.2, lng: 37.16, lv: 2, d: 'Site of January 2026 clashes with the SDF.' },
    { n: 'Hasakah', lat: 36.5, lng: 40.75, lv: 2, d: 'Kurdish-run northeast.' },
    { n: 'Quneitra', lat: 33.13, lng: 35.82, lv: 2, d: 'Southern Syria, where Israel has carried out raids.' }
  ] }
};

/* Oceans, seas and straits. t: 1 always shown, 2 seas, 3 key straits and smaller seas, 4 only when zoomed in. key: strategic chokepoint. */
export const WATERS = [
  { n: 'Pacific Ocean', lat: 8, lng: -140, t: 1 }, { n: 'Pacific Ocean', lat: 18, lng: 165, t: 1 },
  { n: 'Atlantic Ocean', lat: 28, lng: -42, t: 1 }, { n: 'Atlantic Ocean', lat: -22, lng: -16, t: 1 },
  { n: 'Indian Ocean', lat: -22, lng: 78, t: 1 }, { n: 'Arctic Ocean', lat: 84, lng: 20, t: 1 },
  { n: 'Southern Ocean', lat: -60, lng: 100, t: 1 },
  { n: 'Mediterranean Sea', lat: 34.5, lng: 18, t: 2 }, { n: 'Red Sea', lat: 21, lng: 38.4, t: 2 },
  { n: 'Arabian Sea', lat: 15, lng: 64, t: 2 }, { n: 'Bay of Bengal', lat: 14, lng: 88, t: 2 },
  { n: 'South China Sea', lat: 13, lng: 114, t: 2 }, { n: 'East China Sea', lat: 29.5, lng: 126, t: 2 },
  { n: 'Philippine Sea', lat: 20, lng: 133, t: 2 }, { n: 'Sea of Japan', lat: 40, lng: 135, t: 2 },
  { n: 'Caribbean Sea', lat: 15, lng: -75, t: 2 }, { n: 'Gulf of Mexico', lat: 25, lng: -90, t: 2 },
  { n: 'Black Sea', lat: 43.2, lng: 34, t: 2 }, { n: 'Caspian Sea', lat: 41.8, lng: 50.6, t: 2 },
  { n: 'Persian Gulf', lat: 27.2, lng: 51, t: 2 }, { n: 'Baltic Sea', lat: 57.5, lng: 19.5, t: 2 },
  { n: 'North Sea', lat: 56, lng: 3, t: 2 }, { n: 'Bering Sea', lat: 58, lng: -178, t: 2 },
  { n: 'Coral Sea', lat: -17, lng: 155, t: 2 }, { n: 'Tasman Sea', lat: -38, lng: 160, t: 2 },
  { n: 'Gulf of Guinea', lat: 2, lng: 3, t: 2 }, { n: 'Hudson Bay', lat: 60, lng: -85, t: 2 },
  { n: 'Barents Sea', lat: 74, lng: 40, t: 2 },
  { n: 'Strait of Hormuz', lat: 26.57, lng: 56.25, t: 3, key: true },
  { n: 'Bab-el-Mandeb', lat: 12.6, lng: 43.35, t: 3, key: true },
  { n: 'Taiwan Strait', lat: 24.3, lng: 119.6, t: 3, key: true },
  { n: 'Strait of Malacca', lat: 3.2, lng: 100.4, t: 3, key: true },
  { n: 'Suez Canal', lat: 30.5, lng: 32.35, t: 3, key: true },
  { n: 'Bosporus', lat: 41.12, lng: 29.07, t: 3, key: true },
  { n: 'Panama Canal', lat: 9.1, lng: -79.7, t: 3, key: true },
  { n: 'Strait of Gibraltar', lat: 35.95, lng: -5.6, t: 3, key: true },
  { n: 'Gulf of Aden', lat: 12.6, lng: 48, t: 3 }, { n: 'Aegean Sea', lat: 38.6, lng: 25, t: 3 },
  { n: 'Adriatic Sea', lat: 43, lng: 15, t: 3 }, { n: 'Yellow Sea', lat: 35.5, lng: 123, t: 3 },
  { n: 'Gulf of Thailand', lat: 10, lng: 102, t: 3 }, { n: 'Gulf of Oman', lat: 24.6, lng: 58.6, t: 3 },
  { n: 'Kerch Strait', lat: 45.3, lng: 36.55, t: 4, key: true },
  { n: 'Luzon Strait', lat: 20.6, lng: 121.2, t: 4 }, { n: 'Korea Strait', lat: 34.4, lng: 129.2, t: 4 },
  { n: 'English Channel', lat: 50.2, lng: -1.5, t: 4 }, { n: 'Mozambique Channel', lat: -18, lng: 41, t: 4 },
  { n: 'Drake Passage', lat: -58, lng: -65, t: 4 }, { n: 'Bering Strait', lat: 65.8, lng: -169, t: 4 },
  { n: 'Sea of Azov', lat: 46.2, lng: 36.4, t: 4 }, { n: 'Dardanelles', lat: 40.2, lng: 26.4, t: 4 }
];

/* ================= PULSE ================= */
/* Themes for the Pulse view. Order sets the chip order. */
export const PULSE_THEMES = {
  election: { label: 'Elections', color: '#c4a7ff' },
  protest: { label: 'Protests & unrest', color: '#ff7a59' },
  economy: { label: 'Economy & prices', color: '#f2c14e' },
  trade: { label: 'Trade wars', color: '#5fd3a6' },
  energy: { label: 'Energy & shipping', color: '#4fb6ff' },
  ai: { label: 'AI & tech', color: '#7ef0ff' },
  crime: { label: 'Gangs & crime', color: '#e05f8f' }
};

/* Pulse stories. iso: countries it applies to. pin: optional map marker [lat, lng, label]. */
export const PULSE = [
  { theme: 'trade', iso: ['CAN'], date: '2026', pin: [45.42, -75.69, 'Ottawa'],
    t: 'Canada’s push to rely less on the US',
    d: 'Since a January 2026 speech at Davos on how "middle powers" must work together, PM Mark Carney has signed an EVs-for-canola deal with China, toured India, Australia and Japan for new markets, and joined the EU’s defence buying programme. Statistics Canada data shows the US still takes most exports, so economists debate how fast this can work.',
    src: [['Fortune: Carney meant what he said in Davos', 'https://fortune.com/2026/01/28/carney-meant-what-he-said-in-davos-splitting-with-america-new-trade-deals/'], ['The Hub: diversification debate, May 2026', 'https://thehub.ca/2026/05/05/statistics-canada-trade-data-fuels-debate-over-carney-governments-diversification-strategy/']] },
  { theme: 'trade', iso: ['CAN', 'CHN'], date: 'Jan 2026',
    t: 'Canada and China cut EV and canola tariffs',
    d: 'Canada agreed to admit a quota of Chinese electric vehicles at a lower tariff, and China cut tariffs on Canadian canola, resetting a relationship that had been frozen for years.',
    src: [['Al Jazeera, Jan 16, 2026', 'https://www.aljazeera.com/economy/2026/1/16/canada-china-strike-trade-deals-to-slash-tariffs-on-evs-canola'], ['Global News', 'https://globalnews.ca/news/11616295/carney-landmark-china-deal-tariffs-quota']] },
  { theme: 'economy', iso: ['CAN'], date: '2026',
    t: 'Canada rearms with Europe',
    d: 'Canada hit NATO’s 2% defence-spending target and became the first non-European partner in the EU’s €150 billion SAFE programme, letting Canadian firms bid on European defence contracts and vice versa.',
    src: [['The Deep Dive: Canada joins EU defence fund', 'https://thedeepdive.ca/canada-joins-eu-defense-procurement-fund-as-first-non-european-partner/'], ['NOW Toronto: Carney after hitting the NATO target', 'https://nowtoronto.com/news/carney-pledges-to-unleash-half-a-trillion-dollars-after-canada-achieves-nato-spending-target/']] },
  { theme: 'election', iso: ['GBR'], date: 'Jul 2026', pin: [51.5, -0.13, 'London'],
    t: 'Andy Burnham becomes UK prime minister',
    d: 'Keir Starmer resigned, and the former Mayor of Greater Manchester took over in July 2026. He is Britain’s seventh prime minister in about ten years.',
    src: [['NPR: Andy Burnham takes over', 'https://www.nprillinois.org/2026-07-20/andy-burnham-takes-over-as-uk-prime-minister']] },
  { theme: 'economy', iso: ['CHN'], date: 'Mar 2026',
    t: 'China sets its lowest growth target in decades',
    d: 'Beijing aims for 4.5% to 5% growth in 2026 as weak consumer spending, a long property slump and falling prices weigh on the economy. Cheap Chinese exports are fuelling trade fights abroad.',
    src: [['NPR, Mar 5, 2026', 'https://www.npr.org/2026/03/05/g-s1-112586/china-sets-a-lower-economic-growth-target-of-4-5-to-5-for-2026-as-challenges-loom']] },
  { theme: 'trade', iso: ['IND', 'USA'], date: 'Feb 2026',
    t: 'US cuts tariffs on India to 18%',
    d: 'A February 2026 deal cut US tariffs on Indian goods to 18%, down from levels that hit 50% in 2025 over India’s purchases of Russian oil. A final agreement is still pending.',
    src: [['Morgan Lewis, Feb 2026', 'https://www.morganlewis.com/pubs/2026/02/us-india-trade-deal-cuts-tariffs-eases-tensions']] },
  { theme: 'economy', iso: ['JPN'], date: '2026',
    t: 'Japan bets on big spending under Takaichi',
    d: 'After a resounding election win in February 2026, Prime Minister Sanae Takaichi is pushing large stimulus and defence budgets. Stocks hit records while the yen weakened, raising worries about Japan’s debt.',
    src: [['Bloomberg: the catch-22 after Takaichi’s win', 'https://www.bloomberg.com/news/newsletters/2026-02-09/the-catch-22-confronting-japan-s-takaichi-after-her-resounding-election-victory']] },
  { theme: 'economy', iso: ['DEU'], date: 'Sep 2026',
    t: 'Germany edges out of stagnation',
    d: 'After two years of shrinking output, Chancellor Friedrich Merz says he expects about 1.3% growth in 2026, helped by heavy spending on defence and infrastructure. Weak exports to China and high energy costs still hold industry back.',
    src: [['deutschland.de: Merz sees recovery', 'https://www.deutschland.de/en/news/merz-sees-economic-recovery-in-germany'], ['RTÉ: Germany lowers 2026 forecast, Jan 2026', 'https://www.rte.ie/news/business/2026/0128/1555575-germany-lowers-2026-economic-growth-forecast-to-1']] },
  { theme: 'election', iso: ['USA'], date: 'Nov 3, 2026', pin: [38.9, -77.04, 'US midterms'],
    t: 'US midterm elections on November 3',
    d: 'All 435 House seats and about a third of the Senate are on the ballot. Control of Congress decides how much of Trump’s agenda on tariffs, Iran and spending can pass in his final two years.',
    src: [['Khaleej Times: US midterms explainer', 'https://www.khaleejtimes.com/world/americas/us-midterm-elections-2026-voting-explainer'], ['Modern Diplomacy: battleground races', 'https://moderndiplomacy.eu/2026/10/19/2026-us-midterm-elections-explained-key-dates-battleground-races-and-whats-at-stake/']] },
  { theme: 'election', iso: ['ISR'], date: 'Results by Nov 4',
    t: 'Israel’s election ends without a clear winner',
    d: 'Exit polls after the October 27 vote showed neither Netanyahu’s bloc nor the opposition led by Gadi Eisenkot with a majority. Final results are due by November 4, followed by coalition talks that could take weeks.',
    src: [['Ground News: Israel votes', 'https://ground.news/article/704bcf86-81ff-4d81-ac14-a8f01411ffb1']] },
  { theme: 'election', iso: ['BRA'], date: 'Oct 2026', pin: [-15.79, -47.88, 'Brasília'],
    t: 'Lula re-elected in Brazil',
    d: 'President Luiz Inácio Lula da Silva beat Senator Flávio Bolsonaro in the October runoff. Bolsonaro has sought to annul the result.',
    src: [['Benin Web TV: Lula re-elected in runoff', 'https://beninwebtv.bj/en/brazil-lula-re-elected-against-flavio-bolsonaro-in-runoff/']] },
  { theme: 'protest', iso: ['FRA'], date: 'Oct 2026', pin: [48.86, 2.35, 'Paris'],
    t: 'Cost-of-living riots in France',
    d: 'Nationwide protests over prices, fuel and public services turned into some of France’s worst unrest in decades on October 17. Police estimated about 200,000 protesters, and PM Sébastien Lecornu said 1,200 were arrested and 150 officers hurt. The government deployed 70,000 police, and more marches followed on October 24.',
    src: [['The Star/Reuters: protests across Europe, Oct 18', 'https://www.thestar.com.my/news/world/2026/10/18/europe-on-fire-protests-seen-in-france-belgium-italy-portugal-albania-with-many-turning-violent'], ['LIGA.net: hundreds of thousands march again, Oct 24', 'https://news.liga.net/en/amp/world/news/in-france-hundreds-of-thousands-of-people-took-to-the-streets-again-to-protest-the-slogans-were-directed-against-both-macron-and-le-pen']] },
  { theme: 'protest', iso: ['BEL', 'ITA', 'PRT', 'ALB'], date: 'Oct 2026',
    t: 'Protests spread across Europe',
    d: 'Living costs brought people out in Belgium, Italy and Portugal on October 17, with clashes in Brussels and Milan. In Albania, days of protests against corruption and a lack of jobs met water cannon and rubber bullets.',
    src: [['The Star/Reuters, Oct 18', 'https://www.thestar.com.my/news/world/2026/10/18/europe-on-fire-protests-seen-in-france-belgium-italy-portugal-albania-with-many-turning-violent']] },
  { theme: 'protest', iso: ['NPL', 'MDG', 'MAR', 'KEN', 'IDN', 'PER', 'PHL'], date: '2025–26',
    t: 'The Gen Z protest wave',
    d: 'Youth-led protests over corruption, jobs and services toppled Nepal’s government in September 2025 and preceded a military takeover in Madagascar a month later. Similar movements hit Morocco, Kenya, Indonesia, Peru and the Philippines, and researchers say the surge has continued into 2026.',
    src: [['Thomson Reuters Foundation: a year of Gen Z protests', 'https://www.context.news/money-power-people/a-year-of-gen-z-protests-can-they-bring-real-change-in-2026'], ['European Democracy Hub: protest surge continuing in 2026', 'https://europeandemocracyhub.epd.eu/wp-content/uploads/2026/06/The-2025-Surge-in-Global-Protests-Is-Continuing-in-2026.pdf']] },
  { theme: 'trade', iso: ['USA', 'CHN'], date: 'Truce ends Nov 10',
    t: 'US–China trade truce reaches its deadline',
    d: 'The one-year truce Trump and Xi agreed in late 2025 cut US fentanyl tariffs to 10% and paused new tariff hikes until November 10, 2026. China suspended rare-earth export curbs and agreed to buy US soybeans. Whether it is extended is one of the biggest economic questions of the month.',
    src: [['Polsinelli: lower tariffs under the China deal', 'https://www.polsinelli.com/customs/publications/lower-tariffs-take-effect-under-new-china-trade-deal']] },
  { theme: 'trade', iso: ['CAN', 'USA'], date: 'Since Aug 2026',
    t: 'Canada–US tariff fight escalates',
    d: 'The US put 50% tariffs on about US$20 billion of Canadian goods in August 2026, and Canada answered with counter-tariffs from September 8.',
    src: [['Osler: Section 338 tariffs and Canada’s response', 'https://www.osler.com/en/insights/updates/elbows-back-up-u-s-section-338-tariffs-canada-retaliatory-surtaxes-current-landscape/']] },
  { theme: 'trade', iso: ['USA', 'MEX'], date: '2026',
    t: 'Tariffs and the cartel crackdown',
    d: 'Washington ties trade pressure on Mexico to fentanyl and cartels. The killing of cartel leader "El Mencho" in February 2026 set off retaliation.',
    src: [['ROIC, Feb 2026', 'https://www.roic.ai/news/us-mexico-cartel-crackdown-intensifies-as-el-mencho-killing-sparks-retaliation-and-trade-tensions-02-23-2026']] },
  { theme: 'energy', iso: ['IRN', 'OMN'], date: 'Ongoing', pin: [26.57, 56.25, 'Hormuz'],
    t: 'Who controls the Strait of Hormuz',
    d: 'About a fifth of the world’s oil normally passes through the strait. After the 2026 war, Iran and Oman have been negotiating shipping rules, and oil prices swing on every report.',
    src: [['Oman Observer, Sep 2026', 'https://www.omanobserver.om/article/1194118/world/region/oman-iran-deal-on-hormuz-expected-soon-us-iran-officials']] },
  { theme: 'energy', iso: ['YEM', 'SAU', 'EGY'], date: '2026', pin: [12.6, 43.35, 'Bab-el-Mandeb'],
    t: 'Red Sea shipping under Houthi fire',
    d: 'Renewed Houthi attacks on ships and on Saudi Arabia keep many carriers away from the Red Sea route to the Suez Canal, raising costs and cutting Egypt’s canal revenue.',
    src: [['FDD Long War Journal, Aug 2026', 'https://www.fdd.org/analysis/2026/08/06/houthis-escalate-attacks-in-red-sea-and-on-saudi-arabia-riyadh-evaluates-options/']] },
  { theme: 'economy', iso: ['USA', 'CHN', 'IND', 'RUS'], date: 'Oct 2026',
    t: 'Gold above US$3,800 after a record run',
    d: 'Gold broke US$4,000 an ounce for the first time in October 2025 on rate-cut bets and global turmoil. It started October 2026 near US$4,180 and ended the month near US$3,880. Central banks, especially in emerging markets, keep buying it as a hedge against the dollar.',
    src: [['PriceGold: October 2026 prices', 'https://pricegold.net/2026/october/'], ['FXStreet: gold blazes past $4,000, Oct 2025', 'https://www.fxstreet.com/news/gold-blazes-past-4-000-to-all-time-highs-ahead-of-fed-minutes-202510081804']] },
  { theme: 'ai', iso: ['USA', 'CHN', 'TWN'], date: '2026',
    t: 'The AI chip race',
    d: 'Advanced AI chips are now a national-security asset. Washington weighed sweeping new limits on AI-chip exports in 2026, while Taiwan makes most of the world’s cutting-edge chips, which adds weight to every Taiwan Strait crisis.',
    src: [['TechCrunch, Mar 2026: US considering sweeping chip export controls', 'https://techcrunch.com/2026/03/05/us-reportedly-considering-sweeping-new-chip-export-controls/']] },
  { theme: 'crime', iso: ['HTI'], date: 'Oct 2026', pin: [18.54, -72.34, 'Port-au-Prince'],
    t: 'Haiti’s gangs take on a new foreign force',
    d: 'A UN-backed Gang Suppression Force, with troops from Chad and others, replaced the Kenya-led mission in 2026. On October 19, gangs launched their biggest attack yet on the foreign troops.',
    src: [['AP via ClickOnDetroit, Oct 19', 'https://www.clickondetroit.com/news/world/2026/10/19/gangs-in-haiti-target-foreign-troops-in-biggest-attack-since-new-force-began-operations/'], ['Africanews: Chad to deploy 800 troops', 'https://www.africanews.com/amp/2026/03/21/chad-to-deploy-800-troops-to-haitis-gang-suppression-force-as-kenya-steps-back/']] },
  { theme: 'crime', iso: ['MEX'], date: 'Feb 2026', pin: [20.67, -103.35, 'Jalisco'],
    t: 'Cartel violence after "El Mencho"',
    d: 'Mexican forces killed Jalisco cartel leader Nemesio Oseguera, "El Mencho", in February 2026, setting off retaliation, under heavy US pressure to curb fentanyl.',
    src: [['ROIC, Feb 2026', 'https://www.roic.ai/news/us-mexico-cartel-crackdown-intensifies-as-el-mencho-killing-sparks-retaliation-and-trade-tensions-02-23-2026']] }
];

/* Leader profiles, shown when the Leader card is tapped. */
export const LEADERS = {
  UKR: { name: 'Volodymyr Zelensky', since: 'May 2019', how: 'Won the 2019 election with 73% in the runoff as a political outsider. Elections are suspended under martial law, so he has stayed in office past his term, which ended in May 2024.', party: 'Servant of the People, centrist' },
  RUS: { name: 'Vladimir Putin', since: '2000 (president or prime minister ever since)', how: 'Re-elected in 2024 with a reported 87% in a vote that independent observers did not consider free. Constitutional changes in 2020 let him stay until 2036.', party: 'Nationalist conservative, backed by United Russia' },
  ISR: { name: 'Benjamin Netanyahu', since: 'December 2022 (current term)', how: 'Israel’s longest-serving prime minister, also in office 1996–99 and 2009–21. He leads Likud and is on trial for corruption, which he denies. The October 2026 election left no clear majority.', party: 'Likud, right-wing' },
  PSE: { name: 'Mahmoud Abbas', since: 'January 2005', how: 'Elected Palestinian Authority president in 2005 for a four-year term. No presidential election has been held since, and he has set one for November 2027.', party: 'Fatah, secular nationalist' },
  IRN: { name: 'Ayatollah Mojtaba Khamenei', since: 'March 2026', how: 'Chosen by the Assembly of Experts after his father, Ali Khamenei, was killed in US–Israeli strikes. The Revolutionary Guards pledged allegiance straight away.', party: 'Hardline cleric, close to the Revolutionary Guards' },
  USA: { name: 'Donald Trump', since: 'January 2025 (second term; also 2017–21)', how: 'Won the 2024 election. The November 3, 2026 midterms decide whether Republicans keep control of Congress.', party: 'Republican, "America First"' },
  SDN: { name: 'Gen. Abdel Fattah al-Burhan', since: '2019, consolidated by a 2021 coup', how: 'Rose to power after the army removed Omar al-Bashir in 2019, then ousted the civilian-led transition in 2021. His falling-out with RSF leader Hemedti started the 2023 war.', party: 'Sudanese Armed Forces' },
  ETH: { name: 'Abiy Ahmed', since: 'April 2018', how: 'Appointed by the ruling coalition, won the Nobel Peace Prize in 2019, then led the 2020–22 Tigray war. His Prosperity Party won large majorities in 2021 and June 2026.', party: 'Prosperity Party' },
  ERI: { name: 'Isaias Afwerki', since: '1993', how: 'Has led Eritrea since independence. No national election has ever been held.', party: 'PFDJ, the only legal party' },
  COD: { name: 'Félix Tshisekedi', since: 'January 2019', how: 'Won the disputed 2018 election and was re-elected in December 2023.', party: 'UDPS' },
  RWA: { name: 'Paul Kagame', since: '2000 (de facto leader since 1994)', how: 'Led the rebel force that ended the 1994 genocide. Re-elected in 2024 with over 99% of the vote.', party: 'Rwandan Patriotic Front' },
  CHN: { name: 'Xi Jinping', since: '2012 (party leader), 2013 (president)', how: 'Scrapped presidential term limits in 2018 and began an unprecedented third term in 2023. China’s most powerful leader since Mao.', party: 'Chinese Communist Party' },
  TWN: { name: 'Lai Ching-te', since: 'May 2024', how: 'Won the January 2024 election with about 40% in a three-way race. The opposition controls the legislature.', party: 'Democratic Progressive Party, favours Taiwan’s separate identity' },
  IND: { name: 'Narendra Modi', since: 'May 2014', how: 'Won a third term in 2024 but lost his party’s outright majority, so he now relies on coalition partners.', party: 'BJP, Hindu nationalist' },
  PAK: { name: 'Shehbaz Sharif', since: 'March 2024 (also 2022–23)', how: 'Formed a coalition after the disputed February 2024 election. Army chief Field Marshal Asim Munir is widely seen as the most powerful figure.', party: 'PML-N' },
  VEN: { name: 'Delcy Rodríguez', since: 'January 2026 (acting)', how: 'Was Maduro’s vice-president and took over after US forces captured him. She works under heavy US pressure and has set no election date.', party: 'PSUV, chavista' },
  MMR: { name: 'Min Aung Hlaing', since: 'April 2026 as president (ruling since the 2021 coup)', how: 'Led the February 2021 coup, then became president through a parliament filled after a junta-run election.', party: 'Military, backed by the USDP' },
  SYR: { name: 'Ahmed al-Sharaa', since: 'January 2025', how: 'Led the HTS-headed offensive that toppled Bashar al-Assad in December 2024, then was named transitional president. A former al-Qaeda affiliate commander who now presents himself as a pragmatist.', party: 'Formerly Hayat Tahrir al-Sham' },
  CAN: { name: 'Mark Carney', since: 'March 2025', how: 'Former governor of the Bank of Canada and the Bank of England. Won the Liberal leadership in March 2025, then the April 2025 election on a promise to stand up to US tariffs.', party: 'Liberal, centrist' },
  GBR: { name: 'Andy Burnham', since: 'July 2026', how: 'The former Mayor of Greater Manchester took over after Keir Starmer resigned, making him Britain’s seventh prime minister in about a decade.', party: 'Labour, centre-left' },
  DEU: { name: 'Friedrich Merz', since: 'May 2025', how: 'Led the CDU/CSU to first place in the February 2025 election and governs in coalition with the Social Democrats.', party: 'CDU, centre-right' },
  JPN: { name: 'Sanae Takaichi', since: 'October 2025', how: 'Japan’s first woman prime minister. She won a resounding election victory in February 2026 on a big-spending, security-focused platform.', party: 'Liberal Democratic Party, conservative' },
  FRA: { name: 'Emmanuel Macron (president)', since: 'May 2017', how: 'Re-elected in 2022 and cannot run again in 2027. Without a parliamentary majority, governments have struggled, and Sébastien Lecornu is prime minister.', party: 'Renaissance, centrist' },
  BRA: { name: 'Luiz Inácio Lula da Silva', since: 'January 2023 (also 2003–10)', how: 'Won re-election in October 2026, beating Flávio Bolsonaro in the runoff.', party: 'Workers’ Party, left' },
  MEX: { name: 'Claudia Sheinbaum', since: 'October 2024', how: 'Mexico’s first woman president, elected in a landslide in June 2024.', party: 'Morena, left' }
};

/* Pulse connections: how economies are tied together. Same shape as LINKS. */
export const PULSE_LINKS = [
  { a: 'CAN', b: 'USA', type: 'trade', tier: 1, label: 'Canada sells most of its exports to the US',
    d: 'Roughly three-quarters of Canada’s exports go to the US, which makes US tariffs the single biggest risk to Canada’s economy and is why Ottawa is now racing to find other buyers.',
    src: [['The Hub: StatsCan data and diversification, May 2026', 'https://thehub.ca/2026/05/05/statistics-canada-trade-data-fuels-debate-over-carney-governments-diversification-strategy/']] },
  { a: 'USA', b: 'CHN', type: 'tariff', tier: 1, label: 'Tariff truce runs to November 10',
    d: 'The 2025 truce cut tariffs and paused new ones until November 10, 2026, while China suspended rare-earth export curbs. Rare earths matter because China refines most of the world’s supply, which goes into magnets for cars, phones and weapons.',
    src: [['Polsinelli: US–China deal terms', 'https://www.polsinelli.com/customs/publications/lower-tariffs-take-effect-under-new-china-trade-deal']] },
  { a: 'RUS', b: 'IND', type: 'energy', tier: 1, label: 'India buys discounted Russian oil',
    d: 'India became one of the largest buyers of Russian crude after 2022. Washington penalised this with tariffs that reached 50% in 2025, then cut tariffs on India to 18% in a February 2026 deal.',
    src: [['Morgan Lewis: US–India deal cuts tariffs, Feb 2026', 'https://www.morganlewis.com/pubs/2026/02/us-india-trade-deal-cuts-tariffs-eases-tensions']] },
  { a: 'RUS', b: 'CHN', type: 'energy', tier: 1, label: 'Oil and gas keep Russia’s economy going',
    d: 'China is the biggest buyer of Russian oil and pipeline gas, giving Moscow the revenue it needs under Western sanctions.', src: [] },
  { a: 'TWN', b: 'USA', type: 'tech', tier: 1, label: 'Advanced chips',
    d: 'Taiwan, led by TSMC, makes most of the world’s most advanced chips, including those used for AI. The US is pushing to bring more of that production onto American soil.', src: [] },
  { a: 'USA', b: 'MEX', type: 'trade', tier: 1, label: 'North America’s factory floor',
    d: 'Mexico is one of America’s largest trading partners, and car and electronics supply chains cross the border many times. The USMCA trade pact faces its six-year review in 2026.', src: [] },
  { a: 'CAN', b: 'CHN', type: 'trade', tier: 2, label: 'EVs-for-canola deal',
    d: 'In January 2026 Canada agreed to let in a quota of Chinese electric vehicles at a lower tariff, and China cut tariffs on Canadian canola. It was a big step in Ottawa’s push to rely less on the US.',
    src: [['Al Jazeera, Jan 16, 2026', 'https://www.aljazeera.com/economy/2026/1/16/canada-china-strike-trade-deals-to-slash-tariffs-on-evs-canola']] },
  { a: 'CAN', b: 'DEU', type: 'money', tier: 2, label: 'Defence ties with Europe',
    d: 'Canada became the first non-European partner in the EU’s €150 billion SAFE defence procurement programme, and Carney has deepened security and industrial ties with Germany and other European states.',
    src: [['The Deep Dive: Canada joins EU defence fund', 'https://thedeepdive.ca/canada-joins-eu-defense-procurement-fund-as-first-non-european-partner/'], ['CP24: Carney in Germany, Feb 2026', 'https://www.cp24.com/news/money/2026/02/10/carney-set-to-strengthen-security-and-defence-ties-in-germany-this-week/']] },
  { a: 'CHN', b: 'AUS', type: 'trade', tier: 2, label: 'Iron ore',
    d: 'China buys most of Australia’s iron ore, Australia’s biggest export, even though the two are rivals on security.', src: [] },
  { a: 'SAU', b: 'CHN', type: 'energy', tier: 2, label: 'Oil for Asia',
    d: 'China is Saudi Arabia’s largest oil customer, which ties Gulf stability directly to Chinese energy security.', src: [] },
  { a: 'IRN', b: 'CHN', type: 'energy', tier: 2, label: 'Sanctioned oil',
    d: 'China buys most of Iran’s oil exports despite US sanctions, a lifeline for Tehran.', src: [] },
  { a: 'COD', b: 'CHN', type: 'tech', tier: 2, label: 'Cobalt',
    d: 'Congo mines most of the world’s cobalt, much of it by Chinese-owned firms. Cobalt is a key ingredient in lithium-ion batteries.', src: [] },
  { a: 'DEU', b: 'CHN', type: 'trade', tier: 2, label: 'Cars and machinery',
    d: 'China is a vital market for German carmakers and machinery firms, and Chinese competition is now hurting both, a big reason for Germany’s weak growth.', src: [] },
  { a: 'USA', b: 'IND', type: 'tariff', tier: 2, label: 'Tariffs cut to 18%',
    d: 'A February 2026 deal cut US tariffs on Indian goods to 18%. A final agreement is still being negotiated.',
    src: [['Morgan Lewis, Feb 2026', 'https://www.morganlewis.com/pubs/2026/02/us-india-trade-deal-cuts-tariffs-eases-tensions']] },
  { a: 'CAN', b: 'IND', type: 'trade', tier: 3, label: 'Trade reset',
    d: 'Carney travelled to India, Australia and Japan in early 2026 to open new markets for Canadian energy, food and minerals.',
    src: [['WCAX/AP, Feb 2026', 'https://www.wcax.com/2026/02/24/prime-minister-carney-travel-india-australia-japan-diversify-canada-trade-away-us']] },
  { a: 'CAN', b: 'JPN', type: 'trade', tier: 3, label: 'LNG and minerals',
    d: 'Japan is a key buyer for Canada’s new Pacific LNG exports and critical minerals, part of Ottawa’s push away from the US market.',
    src: [['WCAX/AP, Feb 2026', 'https://www.wcax.com/2026/02/24/prime-minister-carney-travel-india-australia-japan-diversify-canada-trade-away-us']] },
  { a: 'NLD', b: 'CHN', type: 'tech', tier: 3, label: 'Chip-making machines',
    d: 'Dutch firm ASML makes the only machines that can print the most advanced chips. Under US pressure, the Netherlands restricts their sale to China.', src: [] },
  { a: 'JPN', b: 'USA', type: 'money', tier: 3, label: 'Biggest holder of US debt',
    d: 'Japan is the largest foreign holder of US Treasury bonds, so moves in the yen and Japanese interest rates ripple into US borrowing costs.', src: [] },
  { a: 'USA', b: 'ARG', type: 'money', tier: 3, label: 'US bailout line',
    d: 'In October 2025 the US Treasury gave Argentina a US$20 billion currency swap line to steady the peso and support President Javier Milei.', src: [] },
  { a: 'EGY', b: 'YEM', type: 'energy', tier: 3, label: 'Suez revenue lost to Red Sea attacks',
    d: 'Houthi attacks near Yemen have pushed ships away from the Red Sea, cutting Egypt’s Suez Canal income, one of its main sources of foreign currency.', src: [] }
];

/* Country overviews for every country. s: what to know. e: the economy now and where it's heading.
   i: key issues [title, text]. w: what to watch. lv: tension level for countries without a full briefing.
   Leaders, government type and alliances come live from Wikidata; numbers come live from the IMF and World Bank. */
export const BRIEF = {
  USA: { s: 'The world’s largest economy and military power, now using tariffs, sanctions and force more freely under a second Trump term. Its choices on trade, Iran, Ukraine and China set the weather for everyone else.',
    e: 'Growth has held up better than most rich countries, driven by consumer spending and a huge AI investment boom. The flip side is sticky inflation from tariffs, a federal deficit of roughly 6% of GDP and national debt above the size of the whole economy. The dollar is still the world’s main reserve and trade currency, but central banks have been buying gold partly to hedge against US sanctions.',
    i: [['Tariffs', 'Broad tariffs on allies and rivals have raised import prices and pushed trading partners such as Canada and the EU to seek other markets.'], ['AI boom', 'Data-centre and chip spending by US tech firms is one of the biggest drivers of global investment, and of electricity demand.'], ['Debt and the Fed', 'Large deficits keep long-term interest rates high, which matters for mortgages worldwide because so much lending is priced off US rates.']],
    w: 'The November 3 midterms, the US–China truce deadline on November 10, and whether inflation lets the Federal Reserve keep cutting rates.' },
  CHN: { s: 'The world’s second-largest economy and biggest manufacturer, run by the Communist Party under Xi Jinping. It is rivalling the US in technology and military power while pressing its claim to Taiwan.',
    e: 'Growth has slowed to its weakest pace in decades. A long property crash has wiped out household wealth, consumers are cautious and prices have been falling, so Beijing leans on exports and factory investment. That flood of cheap goods, from EVs to steel, is triggering tariffs in the US, EU, Canada and beyond. China is also shrinking and aging fast, which caps long-term growth.',
    i: [['Deflation and property', 'Falling prices and unsold homes squeeze local governments and developers, many of which are deep in debt.'], ['Tech race', 'China is pouring money into chips and AI to get around US export controls, and leads in EVs, batteries and solar.'], ['Rare earths', 'It refines most of the world’s rare earths and has shown it will restrict exports as leverage in trade fights.']],
    w: 'Whether the US truce is extended past November 10, new stimulus for consumers, and military pressure on Taiwan.' },
  RUS: { s: 'Fighting its full-scale war in Ukraine for a fifth year under the heaviest sanctions ever imposed on a major economy. Power is concentrated in Vladimir Putin.',
    e: 'The war economy boomed in 2023–24 on military spending, then stalled. Russia’s own central bank admits growth has slowed to near zero, and the economy shrank in early 2026. Interest rates that peaked at 21% are being cut, now in the mid-teens, but the budget deficit is at record levels as oil revenue falls under sanctions and price caps, and the National Wealth Fund’s liquid savings have been heavily drawn down.',
    i: [['Gold and de-dollarization', 'About US$300 billion of Russia’s central bank reserves were frozen in the West in 2022. Since then Moscow has shifted reserves into gold and Chinese yuan, and now settles most trade with China and India in roubles, yuan or rupees rather than dollars. Gold is now a large and growing share of its reserves.'], ['Oil lifeline', 'China and India buy most of its crude, often at a discount. Western price caps, tanker sanctions and Ukrainian drone strikes on refineries all cut into revenue.'], ['Labour shortage', 'Mobilisation, emigration and casualties have left a severe worker shortage, which keeps wages and inflation high.']],
    w: 'Ceasefire talks, oil prices, more Ukrainian strikes on refineries, and whether Europe seizes frozen Russian assets to fund Ukraine.' },
  JPN: { s: 'The world’s fourth-largest economy and America’s closest Pacific ally. Under Prime Minister Sanae Takaichi it is spending more on defence and has clashed with China over Taiwan.',
    e: 'After decades of near-zero inflation, prices and wages are finally rising, so the Bank of Japan has been slowly raising interest rates. Big stimulus spending has lifted stocks to records but weakened the yen and revived worries about Japan’s government debt, the highest in the rich world at over twice GDP. A shrinking, aging population is the long-term drag.',
    i: [['China rift', 'Relations with Beijing broke down after Takaichi’s November 2025 comments on Taiwan, hurting tourism and trade.'], ['Weak yen', 'A cheap yen helps exporters such as Toyota but raises the cost of imported food and energy.'], ['Holder of US debt', 'Japan is the largest foreign owner of US Treasury bonds, so its interest rates ripple through global markets.']],
    w: 'Bank of Japan rate moves, the yen, and tensions with China.' },
  DEU: { s: 'Europe’s largest economy and its industrial core, now rearming and loosening its strict debt rules under Chancellor Friedrich Merz.',
    e: 'Germany shrank in 2023 and 2024 as cheap Russian gas disappeared and Chinese competition hit its carmakers and machinery firms. A huge new spending plan for defence and infrastructure is expected to lift growth to roughly 1% in 2026, but industry is still under pressure from high energy costs and US tariffs.',
    i: [['Car industry', 'Volkswagen, BMW and Mercedes are cutting jobs as they lose market share in China and face the shift to electric cars.'], ['Rearmament', 'Germany is building up its army and has become Ukraine’s largest military backer in Europe.'], ['Far right', 'The AfD is polling near the top nationally, putting pressure on the coalition.']],
    w: 'Whether the spending plan delivers growth, and the AfD’s rise.' },
  IND: { s: 'The world’s most populous country and fastest-growing major economy. It balances ties with the US and Russia while competing with China.',
    e: 'India has been growing about 6% to 7% a year, powered by public infrastructure spending, services exports and a young workforce. A February 2026 deal cut US tariffs on Indian goods to 18% after they had reached 50% over India’s purchases of Russian oil. Creating enough jobs for millions of young people each year is the big challenge.',
    i: [['Russian oil', 'Discounted Russian crude cut India’s energy bill but strained relations with Washington.'], ['Manufacturing push', 'Firms such as Apple are moving some production from China to India.'], ['Pakistan and China', 'Frozen relations with Pakistan since the May 2025 fighting, and a disputed Himalayan border with China.']],
    w: 'The final US trade deal, and whether manufacturing jobs keep up with a young, growing workforce.' },
  GBR: { s: 'A nuclear-armed UN Security Council member and Europe’s second-largest economy. Andy Burnham became prime minister in July 2026 after Keir Starmer resigned.',
    e: 'Growth has been weak since the pandemic and Brexit, productivity is stagnant, and high borrowing costs limit what the government can spend. Inflation has run above the Bank of England’s 2% target, keeping interest rates relatively high, while living costs remain the top concern for voters.',
    i: [['Political churn', 'Seven prime ministers in about a decade, with Reform UK challenging both main parties.'], ['Public finances', 'Debt near 100% of GDP and high interest bills make tax rises and spending cuts a constant fight.'], ['Ukraine and defence', 'A leading backer of Ukraine and part of the AUKUS submarine pact with the US and Australia.']],
    w: 'Burnham’s first budget and how markets react to UK borrowing.' },
  FRA: { s: 'A nuclear power and the EU’s second-largest economy, gripped in 2026 by its worst unrest in decades over the cost of living.',
    e: 'France has one of the highest budget deficits in the euro area and debt above 110% of GDP. Repeated governments have fallen trying to pass budgets, because President Macron has no majority in parliament. Growth is modest, and investors now charge France more to borrow than some southern European countries.',
    i: [['Street protests', 'October 2026 protests over prices and fuel turned violent, with 1,200 arrests in one day.'], ['Hung parliament', 'Neither the left, the centre nor the far-right National Rally can govern alone.'], ['2027 election', 'Macron cannot run again, and the National Rally has led many polls.']],
    w: 'Whether a 2027 budget passes, more protests, and the race to succeed Macron.' },
  ITA: { s: 'The euro area’s third-largest economy, with one of Europe’s most stable governments under Giorgia Meloni.',
    e: 'Italy has grown slowly but steadily, helped by EU recovery funds and tourism. Its government debt, about 135% of GDP, is among the highest in the world, but the budget deficit has come down and borrowing costs have fallen, a sign of renewed investor confidence. A rapidly aging, shrinking population is the long-term problem.',
    i: [['Debt', 'Debt this large makes Italy sensitive to any rise in euro interest rates.'], ['Migration', 'Mediterranean crossings shape politics and its deals with Libya, Tunisia and Albania.']],
    w: 'Cost-of-living protests, which reached Milan in October 2026.' },
  CAN: { s: 'A G7 economy with vast energy, mineral and farm resources, now trying hard to rely less on the United States, which buys about three-quarters of its exports.',
    e: 'US tariffs have hit steel, aluminium, autos and lumber, and a 50% tariff on about US$20 billion of goods in August 2026 deepened the fight. Growth has slowed and unemployment has risen. Ottawa is responding with new trade deals in Asia and Europe, faster approval of pipelines and LNG export terminals to reach new buyers, and big defence spending. Housing affordability remains a major domestic issue.',
    i: [['Trade diversification', 'An EVs-for-canola deal with China, trade missions to India, Japan and Australia, and deeper ties with the EU.'], ['Defence', 'Canada hit NATO’s 2% target and became the first non-European partner in the EU’s €150 billion SAFE defence programme.'], ['USMCA review', 'The North American trade pact’s 2026 review will decide the terms of Canada’s most important market.'], ['Arctic', 'Melting ice and US interest in Greenland are making Arctic sovereignty and defence more urgent.']],
    w: 'The USMCA review, more US tariffs, and whether new markets in Asia and Europe can grow fast enough.' },
  BRA: { s: 'Latin America’s largest economy and a leading voice for the developing world. Lula was re-elected in October 2026.',
    e: 'Brazil is a farming and mining superpower, the top exporter of soybeans, coffee, beef and iron ore, much of it to China. Growth has been decent, but high government spending and debt have forced the central bank to keep interest rates among the world’s highest, near 15%, which weighs on business.',
    i: [['China trade', 'China is Brazil’s biggest customer, which links Brazil’s fortunes to Chinese demand.'], ['Amazon', 'Deforestation fell sharply under Lula, a key test of his green agenda.'], ['Polarisation', 'The Bolsonaro family’s challenge to the October result keeps politics tense.']],
    w: 'Whether interest rates finally fall, and the fallout from the disputed runoff.' },
  KOR: { s: 'A tech and manufacturing powerhouse home to Samsung, SK Hynix and Hyundai, facing a nuclear-armed North Korea.',
    e: 'Exports of memory chips for AI have boomed, but the rest of the economy is sluggish and households carry heavy debt. South Korea has the world’s lowest fertility rate, under 1 child per woman, which means a rapidly shrinking workforce.',
    i: [['AI chips', 'SK Hynix and Samsung make the high-bandwidth memory used in AI chips, so Korea rides the AI boom.'], ['US tariffs', 'Korea pledged large investments in the US to secure lower tariffs.'], ['North Korea', 'Pyongyang keeps expanding its nuclear arsenal and has sent troops to help Russia.']],
    w: 'Chip exports and any North Korean weapons tests.' },
  AUS: { s: 'A stable democracy and close US ally whose biggest customer is China.',
    e: 'Australia has avoided recession for most of three decades by selling iron ore, coal, gas and farm goods, mostly to China. Housing is among the least affordable in the world. It is spending heavily on nuclear-powered submarines under AUKUS.',
    i: [['China', 'Relations have thawed since Beijing lifted trade bans, but security tensions remain.'], ['Critical minerals', 'Australia is positioning itself as a non-Chinese source of lithium and rare earths.']],
    w: 'Chinese demand for iron ore, which drives the budget.' },
  MEX: { s: 'The US’s largest trading partner and one of the world’s most violent countries because of cartel wars.',
    e: 'Manufacturing for the US market drives the economy, and companies moving production out of China have boosted investment. But US tariffs, uncertainty over the 2026 USMCA review and weak growth have hurt. Money sent home by Mexicans in the US is a major source of income.',
    i: [['Cartels', 'The February 2026 killing of Jalisco cartel boss "El Mencho" set off retaliation.'], ['USMCA review', 'The 2026 review of the North American trade deal is critical for Mexico’s factories.']],
    w: 'US tariffs and any US military action against cartels.' },
  IDN: { s: 'The world’s fourth-most-populous country and largest Muslim-majority democracy, and Southeast Asia’s biggest economy.',
    e: 'Growth has held around 5% a year, powered by consumers and by nickel processing for EV batteries, where Indonesia now dominates world supply. Big spending pledges, including free school meals, have raised worries about the budget and pushed down the rupiah.',
    i: [['Nickel', 'Indonesia banned raw nickel exports to force processing at home, mostly by Chinese firms.'], ['Protests', 'Deadly protests over lawmakers’ perks shook the government in 2025.']],
    w: 'The rupiah and public finances.' },
  SAU: { lv: 2, s: 'The world’s top oil exporter and leader of OPEC+, spending heavily to diversify under Crown Prince Mohammed bin Salman.',
    e: 'Lower oil prices for much of 2025 pushed the budget into deficit and forced Riyadh to borrow and scale back some giant Vision 2030 projects such as Neom. The 2026 Gulf war and Hormuz disruption raised oil prices but also threatened its own exports and cities.',
    i: [['Oil policy', 'OPEC+ output decisions move world fuel prices, including at Canadian pumps.'], ['Houthi attacks', 'The Houthis escalated attacks on Saudi Arabia and Red Sea shipping in 2026.']],
    w: 'Oil prices and OPEC+ meetings.' },
  TUR: { lv: 1, s: 'A NATO member that controls the Bosporus and plays every side, from Ukraine to Russia to the Gulf.',
    e: 'Turkey is fighting chronic high inflation. After years of unorthodox low rates, the central bank raised rates sharply. Inflation fell but was still above 30% in mid-2026, far above its target, after the war-driven energy shock. The lira keeps hitting record lows.',
    i: [['Inflation', 'Prices rising around 30% a year squeeze wages and fuel discontent.'], ['Politics', 'The jailing of Istanbul mayor Ekrem İmamoğlu, Erdoğan’s main rival, set off mass protests in 2025.'], ['Mediator', 'Turkey hosts Russia–Ukraine talks and has influence in Syria.']],
    w: 'The lira and interest rates.' },
  ARG: { lv: 1, s: 'Latin America’s third-largest economy, in the middle of Javier Milei’s radical free-market experiment.',
    e: 'Milei slashed spending to balance the budget and brought inflation down from over 200% to far lower levels, but monthly inflation crept back up in 2026 and many Argentines say they are worse off. The US backed the peso with a US$20 billion swap line in October 2025, and an IMF programme supports reserves.',
    i: [['Inflation', 'Inflation was rising again in early 2026, testing Milei’s promise to end it.'], ['Dollar shortage', 'Low central bank reserves keep the peso fragile.']],
    w: 'Monthly inflation and the peso.' },
  ZAF: { s: 'Africa’s most industrialised economy and a democracy governed by a coalition led by the ANC.',
    e: 'Growth has been stuck near 1% for years because of power cuts, broken railways and ports, and crime. Rolling blackouts have mostly ended, but unemployment is above 30%, among the highest in the world. Relations with the Trump administration are strained, and the US cut aid and raised tariffs.',
    i: [['Unemployment', 'Over 30% overall and far higher for young people.'], ['US relations', 'Disputes over land reform and South Africa’s genocide case against Israel.']],
    w: 'Whether the coalition holds and reforms speed up.' },
  NGA: { lv: 2, s: 'Africa’s most populous country and one of its largest economies, facing jihadist insurgency, kidnapping gangs and farmer-herder violence.',
    e: 'President Tinubu ended fuel subsidies and let the naira float, which sent inflation above 30% and caused hardship but improved government finances. Oil output has recovered somewhat, and the giant Dangote refinery is reducing fuel imports.',
    i: [['Insecurity', 'Boko Haram and ISWAP in the northeast, bandits in the northwest, clashes in the Middle Belt.'], ['Cost of living', 'Food prices have soared after reforms.']],
    w: 'Inflation and security ahead of the 2027 election.' },
  EGY: { lv: 1, s: 'The Arab world’s most populous country, guardian of the Suez Canal and a key mediator on Gaza.',
    e: 'Egypt is deeply indebted and has relied on bailouts from the IMF, the UAE and the Gulf. Houthi attacks on Red Sea shipping cut Suez Canal revenue, one of its biggest sources of dollars. Inflation has eased from record highs after the pound was devalued.',
    i: [['Suez revenue', 'Fewer ships through the Red Sea means fewer dollars.'], ['Nile dam', 'Egypt fears Ethiopia’s giant dam threatens its water supply.'], ['Gaza', 'Egypt shares Gaza’s only non-Israeli border crossing at Rafah.']],
    w: 'Shipping traffic through Suez and IMF reviews.' },
  ESP: { s: 'One of Europe’s best-performing large economies, governed by a fragile minority government.',
    e: 'Spain has grown faster than most of the euro area, helped by tourism, immigration and cheap solar power, and unemployment has fallen, though it remains the highest in the EU. Housing costs are the top public concern and have sparked protests.',
    i: [['Housing', 'Rents and prices have surged, especially in Madrid, Barcelona and tourist areas.'], ['Politics', 'Corruption cases and a minority parliament make governing hard.']],
    w: 'Housing protests and whether the government reaches its full term.' },
  POL: { s: 'NATO’s front line with Russia and Belarus and one of Europe’s fastest-growing economies.',
    e: 'Poland’s economy has grown strongly for three decades and keeps outpacing Western Europe. It spends over 4% of GDP on defence, the highest share in NATO, and is the main hub for Western aid to Ukraine.',
    i: [['Defence', 'Building one of Europe’s largest armies.'], ['Divided politics', 'A pro-EU government faces a nationalist president who can block laws.']],
    w: 'Russian drone and sabotage incidents near its border.' },
  UKR: { e: 'The war shrank the economy by about a third in 2022. It has partly recovered but depends on foreign aid to pay soldiers, pensions and public workers. Russian strikes on power plants cause regular blackouts. The EU has agreed large loans backed by frozen Russian assets, and rebuilding is estimated to cost over US$500 billion.' },
  ISR: { e: 'Israel’s tech-driven economy has proven resilient, but years of war have raised defence spending and the budget deficit, and the call-up of reservists has strained businesses. Credit agencies downgraded its rating during the wars.' },
  ARE: { s: 'A Gulf trade, finance and aviation hub with growing influence from Sudan to Ethiopia to Libya.',
    e: 'The UAE is one of the most diversified Gulf economies, built on Dubai trade and tourism, Abu Dhabi oil wealth and huge sovereign funds that invest worldwide, including in AI. It is accused, including by Sudan’s government, of arming the RSF, which it denies.',
    i: [['Regional power', 'Backs Ethiopia and, according to UN experts and the US, Sudan’s RSF. The UAE denies supporting the RSF.'], ['AI investment', 'Building giant data centres with US partners.']],
    w: 'Gulf security after the Iran war.' },
  TWN: { e: 'Taiwan’s economy is booming on AI chip demand. TSMC makes most of the world’s most advanced chips, so a crisis in the Taiwan Strait would hit the whole world’s supply of phones, cars and AI systems. Taiwan pledged large chip investments in the US to ease tariffs.' },
  PAK: { e: 'Pakistan has avoided default with a series of IMF bailouts and loans from China, Saudi Arabia and the UAE. Inflation has fallen sharply from its 2023 peak, but growth is slow, debt is high and climate disasters such as floods regularly cause heavy damage.' },
  VEN: { e: 'Venezuela has the world’s largest proven oil reserves, but output collapsed under Maduro and sanctions. After his capture, Washington is steering its oil sector, and the question is how fast production and foreign investment can recover.' },
  IRN: { e: 'Iran’s economy was already weak from sanctions before the 2026 war. Since then the rial has collapsed, inflation has reportedly reached about 100%, jobs have disappeared and the US naval blockade choked oil exports until the June interim deal. China remains the main buyer of its oil.' },
  SDN: { e: 'The war has destroyed much of Sudan’s economy, including Khartoum’s industry and banks. Gold, much of it smuggled to the UAE, finances both sides. The UN calls it the world’s worst humanitarian crisis.' },
  ETH: { e: 'Ethiopia had been one of Africa’s fastest-growing economies and officials project more than 10% growth in 2026, but debt default, war and inflation have strained it. It floated the birr in 2024 under an IMF deal.' },
  COD: { e: 'Congo holds vast cobalt, copper and coltan used in batteries and electronics, and mines most of the world’s cobalt, much of it through Chinese companies. Despite that wealth, most Congolese live in poverty.' },
  SYR: { e: 'After 13 years of war, the economy is a fraction of its pre-war size. The lifting of most US and EU sanctions in 2025 opened the door to Gulf investment and reconstruction, which could cost hundreds of billions of dollars.' },
  MMR: { e: 'Civil war and the 2021 coup have devastated the economy. Myanmar is now one of the world’s largest sources of opium and of online scam centres run by criminal gangs.' },
  PSE: { e: 'Gaza’s economy has been almost entirely destroyed, and the UN estimates rebuilding will cost tens of billions of dollars. The West Bank economy has been hit by Israeli restrictions on Palestinian workers and withheld tax revenues.' },
  ERI: { e: 'One of the world’s most closed economies, with indefinite national service that drives large-scale emigration.' },
  RWA: { e: 'Rwanda has grown fast and is seen as well run, but relies on aid, and Western donors have cut some funding over its backing of M23, which it denies.' }
};

Object.assign(BRIEF, {
  /* ---- Europe ---- */
  NLD: { s: 'A trade gateway to Europe through Rotterdam, Europe’s largest port, and home of ASML, the only maker of the machines that print the most advanced chips.', e: 'A wealthy, export-driven economy. Under US pressure it restricts ASML sales to China, putting it at the centre of the chip war. Housing shortages and migration dominate politics.' },
  BEL: { s: 'Host of the EU and NATO headquarters in Brussels.', e: 'Belgium matters for Russia policy because Euroclear, based in Brussels, holds most of the roughly €200 billion of Russian central bank assets frozen in Europe. Cost-of-living protests turned violent in October 2026.' },
  CHE: { s: 'Neutral, wealthy and a global hub for banking, commodities trading and pharmaceuticals.', e: 'Switzerland was hit by a 39% US tariff in 2025 before negotiating it down. The strong franc keeps inflation near zero and acts as a safe haven when markets are nervous.' },
  AUT: { s: 'A neutral EU state on the frontier with the Balkans and a historic transit route for Russian gas.', e: 'Austria’s industry-heavy economy shrank for two years as energy costs rose and German demand weakened. The far-right Freedom Party now leads national polls.' },
  IRL: { s: 'EU home base for Apple, Google, Meta and big drugmakers, drawn by low corporate tax.', e: 'Huge tax receipts from US multinationals give Ireland a budget surplus, but it is exposed to US tariffs on pharmaceuticals and to US tax changes. Housing shortages are the top domestic issue.' },
  PRT: { s: 'A popular destination for tourists and expatriates, and one of the euro area’s steadier economies.', e: 'Growth and public finances have improved, but housing costs have soared, and thousands marched in Lisbon in October 2026 over rents and wages.' },
  GRC: { s: 'An EU and NATO member recovering from its 2010s debt crisis, with long-running disputes with Turkey.', e: 'Greece has returned to investment-grade credit and steady growth, helped by tourism and shipping, the world’s largest merchant fleet by value. Debt is still around 150% of GDP.' },
  SWE: { s: 'A NATO member since 2024, guarding the Baltic Sea against Russia.', e: 'A high-tech, export-driven economy. Gang violence and immigration have reshaped politics, and the country held a general election in September 2026.' },
  NOR: { s: 'A NATO member bordering Russia in the Arctic and Europe’s biggest gas supplier since Russian flows were cut.', e: 'Oil and gas revenue has built the world’s largest sovereign wealth fund, worth about US$2 trillion, which owns roughly 1.5% of all listed companies globally.' },
  FIN: { s: 'NATO’s newest frontline state, with a 1,340 km border with Russia.', e: 'Growth has been weak and unemployment is among the highest in the EU. Finland closed its border crossings with Russia, accusing Moscow of pushing migrants across.' },
  DNK: { lv: 1, s: 'Greenland, a self-governing part of Denmark, is the focus of Trump’s push for US control.', e: 'A wealthy, stable economy boosted by drugmaker Novo Nordisk and its weight-loss drugs. Denmark is spending heavily on Arctic defence in response to US pressure over Greenland.' },
  GRL: { lv: 1, s: 'The world’s largest island, a self-governing part of Denmark, rich in rare earths and strategically placed between North America and Russia.', e: 'The economy relies on fishing and a large annual grant from Denmark. Trump says the US should control Greenland; its leaders say they choose Denmark, and many favour eventual independence.' },
  ISL: { s: 'A NATO member without an army, hosting key North Atlantic air and sea monitoring.', e: 'Tourism, fishing and aluminium smelting drive a small, wealthy economy.' },
  EST: { s: 'A Baltic NATO and EU member bordering Russia, and a leader in digital government.', e: 'Estonia spends over 3% of GDP on defence and faces cyberattacks, airspace violations and undersea-cable sabotage blamed on Russia.' },
  LVA: { s: 'A Baltic NATO member with a large Russian-speaking minority and a border with Russia and Belarus.', e: 'A small open economy that cut off Russian energy and is building fortifications on its eastern border.' },
  LTU: { s: 'A Baltic NATO member squeezed between Belarus and Russia’s Kaliningrad exclave.', e: 'Lithuania spends heavily on defence and hosts a permanent German army brigade. Belarus has sent smuggling balloons across the border.' },
  CZE: { s: 'A central European EU and NATO member with a strong manufacturing base.', e: 'The car industry, tied to German demand, has struggled. A government led by Andrej Babiš took office in late 2025, more sceptical of the EU and of military aid to Ukraine.' },
  SVK: { lv: 1, s: 'An EU and NATO member whose government under Robert Fico is friendlier to Moscow than most of the EU.', e: 'The economy depends heavily on car factories. Fico’s government has faced large street protests over its Russia stance and changes to the media and courts.' },
  HUN: { s: 'Ended Viktor Orbán’s 16-year rule in April 2026, when Péter Magyar’s pro-EU Tisza party won a two-thirds majority.', e: 'The new government is trying to unlock billions in EU funds frozen over rule-of-law concerns. Inflation was among the highest in the EU and growth has been weak.' },
  ROU: { s: 'An EU and NATO member on the Black Sea that hosts NATO troops and borders Ukraine and Moldova.', e: 'Romania has the EU’s largest budget deficit and must cut spending. Its 2024 presidential election was annulled over alleged Russian interference, and a pro-EU candidate won the 2025 rerun.' },
  BGR: { s: 'The EU’s poorest member, which joined the euro in January 2026.', e: 'Euro membership should lower borrowing costs. Politics has been unstable, with repeated elections and mass anti-corruption protests that brought down the government in late 2025.' },
  HRV: { s: 'An EU, euro and NATO member on the Adriatic.', e: 'Tourism and EU funds drive growth, and inflation has been among the highest in the euro area.' },
  SVN: { s: 'A small, prosperous EU and euro member between the Alps and the Adriatic.', e: 'An export-oriented economy closely tied to German industry.' },
  SRB: { lv: 1, s: 'The largest Balkan state, balancing between the EU, Russia and China, and gripped by mass protests since a deadly station canopy collapse in Novi Sad in November 2024.', e: 'Serbia relies on Chinese investment in mining and factories, and on Russian gas. Protesters blame corruption for the disaster and have demanded new elections.' },
  BIH: { lv: 1, s: 'A divided state where the Serb-run Republika Srpska has repeatedly threatened to break away.', e: 'One of Europe’s poorer economies, held back by a complex power-sharing system and emigration.' },
  MNE: { s: 'A small NATO member and front-runner to join the EU.', e: 'Tourism dominates the economy, and Montenegro uses the euro without being in the euro area.' },
  MKD: { s: 'A NATO member whose EU bid has been blocked by disputes with neighbours over identity and language.', e: 'A small economy dependent on remittances and car parts manufacturing.' },
  ALB: { s: 'A NATO member pushing to join the EU by 2030, where anti-government protests turned violent in October 2026.', e: 'Tourism is booming, but corruption and emigration of young people are major problems. Albania hosts migrant centres for Italy.' },
  KOS: { lv: 1, s: 'Declared independence from Serbia in 2008. Most Western states recognise it, Serbia and Russia do not.', e: 'One of Europe’s poorest economies, reliant on remittances. Tensions flare in the Serb-majority north, where NATO peacekeepers remain.' },
  MDA: { lv: 1, s: 'A small EU candidate between Romania and Ukraine, with a Russian-backed breakaway region, Transnistria.', e: 'Pro-EU parties won the September 2025 election despite what officials called massive Russian interference. Moldova lost cheap Russian gas, and Transnistria faces an energy crisis.' },
  BLR: { lv: 2, s: 'Russia’s closest ally, ruled by Alexander Lukashenko since 1994, which let Russia invade Ukraine from its territory and hosts Russian nuclear weapons.', e: 'Heavily dependent on Russian loans and markets. Minsk has released some political prisoners in exchange for easing of US sanctions.' },
  CYP: { s: 'An EU member divided since 1974 between the Greek Cypriot south and a Turkish-backed north.', e: 'Finance, shipping and tourism drive the economy. It has been a hub for Russian money, and UN-led reunification talks have stalled for years.' },
  CYN: { s: 'The self-declared Turkish Republic of Northern Cyprus, recognised only by Turkey.', e: 'Depends on Turkey for money and trade.' },
  LUX: { s: 'A founding EU member and one of the world’s richest countries per person.', e: 'A major centre for investment funds and banking.' },
  GEO: { lv: 2, s: 'A South Caucasus country where the ruling Georgian Dream party has turned away from the EU, sparking daily protests since late 2024.', e: 'The government suspended EU accession talks and passed laws critics compare to Russia’s. Hundreds of protesters and opposition figures have been jailed. Georgia profits from trade routes that bypass Russia.' },
  ARM: { lv: 1, s: 'A South Caucasus country that lost Nagorno-Karabakh to Azerbaijan in 2023 and is shifting away from Russia toward the West.', e: 'Armenia initialed a peace deal with Azerbaijan in August 2025, including a US-backed transit route through its south. Its economy grew fast as a hub for trade with Russia.' },
  AZE: { lv: 1, s: 'An oil and gas exporter that retook Nagorno-Karabakh in 2023, ruled by President Ilham Aliyev.', e: 'Gas exports to Europe raised its importance after Russian supplies were cut. Relations with Moscow have soured, and a peace deal with Armenia awaits formal signing.' },
  /* ---- Central Asia ---- */
  KAZ: { s: 'Central Asia’s largest economy, rich in oil, uranium and metals, balancing Russia, China and the West.', e: 'Kazakhstan is the world’s top uranium producer. Most of its oil reaches markets through a pipeline across Russia, which Moscow has disrupted at times.' },
  UZB: { s: 'Central Asia’s most populous country, opening up after decades of isolation.', e: 'A fast-growing economy based on gold, gas, cotton and remittances from workers in Russia.' },
  KGZ: { s: 'A small mountain republic and close Russian ally.', e: 'Remittances from Russia make up a large share of the economy. It has been accused of helping Russia evade sanctions.' },
  TJK: { s: 'Central Asia’s poorest country, bordering Afghanistan.', e: 'Remittances from Russia are among the largest in the world relative to GDP. A 2025 border deal with Kyrgyzstan ended years of deadly clashes.' },
  TKM: { s: 'One of the world’s most closed states, with huge gas reserves.', e: 'Sells most of its gas to China.' },
  MNG: { s: 'A democracy squeezed between Russia and China.', e: 'Coal and copper exports to China drive the economy, and politics has been unstable, with repeated changes of prime minister.' },
  /* ---- South Asia ---- */
  AFG: { lv: 2, s: 'Ruled by the Taliban since 2021. Russia became the first country to formally recognise their government in 2025.', e: 'Most aid was cut after the takeover, and women are barred from secondary school and most work. Border fighting with Pakistan flared in October 2025 and February 2026, and Pakistan and Iran have expelled millions of Afghans.' },
  BGD: { s: 'One of the world’s most densely populated countries, voting in February 2026 in its first election since mass protests ousted Sheikh Hasina in 2024.', e: 'The world’s second-largest clothing exporter after China, hit by US tariffs. The Bangladesh Nationalist Party won the 2026 election.' },
  NPL: { lv: 1, s: 'A Himalayan republic where Gen Z protests toppled the government in September 2025.', e: 'Relies on remittances and tourism. An interim government led the country to elections in March 2026.' },
  LKA: { s: 'An island nation recovering from a 2022 default and economic collapse.', e: 'An IMF programme restored growth, but a devastating cyclone in late 2025 caused heavy damage. India and China compete for influence over its ports.' },
  BTN: { s: 'A small Himalayan kingdom between India and China.', e: 'Earns most of its income selling hydropower to India.' },
  /* ---- East and Southeast Asia ---- */
  PRK: { lv: 2, s: 'A nuclear-armed dictatorship under Kim Jong Un, now openly allied with Russia.', e: 'North Korea has sent troops and munitions to Russia in return for money, food and likely military technology, helping it survive sanctions.' },
  VNM: { s: 'A one-party state and one of the world’s fastest-growing manufacturing hubs.', e: 'Firms moving out of China have made Vietnam a major exporter to the US, which put a 20% tariff on its goods. The Communist Party is carrying out sweeping reforms to cut bureaucracy.' },
  THA: { lv: 1, s: 'Southeast Asia’s second-largest economy, which fought a deadly border conflict with Cambodia in 2025.', e: 'Growth has been sluggish and household debt is among the highest in Asia. A nationalist-leaning result in the early-2026 election hardened its stance on Cambodia.' },
  KHM: { lv: 1, s: 'A close Chinese partner that fought a border conflict with Thailand in 2025.', e: 'Garment exports and tourism drive the economy. Cambodia is a hub for online scam compounds run by criminal gangs, which have trapped thousands of trafficked workers.' },
  LAO: { s: 'A landlocked one-party state deeply in debt to China.', e: 'Chinese loans for railways and dams pushed debt to dangerous levels, and inflation has been high.' },
  MYS: { s: 'A trading nation on the Strait of Malacca and a growing hub for chip packaging and data centres.', e: 'Steady growth, boosted by AI data centres in Johor. It claims parts of the South China Sea.' },
  PHL: { lv: 2, s: 'A US treaty ally in a growing confrontation with China in the South China Sea.', e: 'Growth is solid on consumer spending and remittances. A flood-control corruption scandal sparked large protests in 2025, and former president Duterte is on trial at the International Criminal Court.' },
  BRN: { s: 'A small, oil-rich sultanate on Borneo.', e: 'Oil and gas fund generous public services.' },
  TLS: { s: 'Asia’s youngest democracy, which joined ASEAN in 2025.', e: 'Depends on a petroleum fund that is running down as offshore gas fields deplete.' },
  /* ---- Middle East ---- */
  IRQ: { lv: 1, s: 'A major oil producer balancing between the US and Iran, with powerful Iran-aligned militias.', e: 'Oil pays for almost all government spending, so low prices hit hard. The US is drawing down its troops, and pressure is rising on Baghdad to rein in the militias.' },
  JOR: { s: 'A key US ally bordering Israel, the West Bank, Syria and Iraq.', e: 'Depends on foreign aid and hosts large numbers of Palestinian and Syrian refugees.' },
  LBN: { lv: 2, s: 'A fragile state where the government is trying to disarm Hezbollah after its war with Israel.', e: 'Still recovering from a 2019 financial collapse in which depositors lost most of their savings. Israel keeps striking targets it links to Hezbollah.' },
  KWT: { s: 'A small, oil-rich Gulf state that holds one of the oldest sovereign wealth funds.', e: 'Oil provides nearly all revenue. The emir suspended parliament in 2024.' },
  QAT: { s: 'A gas giant and key mediator between Israel and Hamas, the US and the Taliban, and others.', e: 'One of the world’s largest LNG exporters. Israel struck Hamas leaders in Doha in September 2025, a shock to Gulf security.' },
  OMN: { s: 'A neutral Gulf sultanate on the Strait of Hormuz that mediates between Iran and the West.', e: 'Oman is negotiating new shipping rules for Hormuz with Iran. Its economy relies on oil and gas.' },
  YEM: { lv: 3, s: 'Split between the Iran-backed Houthis, who hold the capital Sanaa, and a Saudi-backed government in the south.', e: 'One of the world’s worst humanitarian crises. Houthi attacks on shipping and Saudi Arabia escalated in 2026.' },
  /* ---- North Africa and Sahel ---- */
  MAR: { lv: 1, s: 'A North African monarchy that controls most of Western Sahara.', e: 'Growing car and phosphate industries, and it is co-hosting the 2030 World Cup. Gen Z protests in 2025 attacked spending on stadiums over hospitals and schools.' },
  DZA: { lv: 1, s: 'Africa’s largest country by area and a major gas supplier to Europe.', e: 'Oil and gas fund most of the state. It backs the Polisario Front in Western Sahara, and relations with Morocco and France are strained.' },
  TUN: { s: 'Birthplace of the 2011 Arab Spring, now increasingly authoritarian under President Kais Saied.', e: 'A weak economy, heavy debt and shortages. It is a main departure point for migrants heading to Italy.' },
  LBY: { lv: 2, s: 'Split between rival governments in Tripoli and the east since 2014.', e: 'Oil exports keep the economy going, but rival militias fight over the revenue. Russia uses eastern bases to supply its operations in Africa.' },
  ESH: { lv: 1, s: 'Disputed territory mostly controlled by Morocco and claimed by the Algeria-backed Polisario Front.', e: 'A UN resolution in 2025 backed Morocco’s autonomy plan as the basis for talks.' },
  MRT: { s: 'A desert state on the edge of the Sahel that has avoided the jihadist violence hitting its neighbours.', e: 'Mining and new offshore gas exports with Senegal.' },
  MLI: { lv: 3, s: 'Run by a military junta that expelled French troops and works with Russia’s Africa Corps.', e: 'Jihadist group JNIM blockaded fuel to the capital Bamako in late 2025. Gold provides most export income, and the junta has seized foreign mining assets.' },
  BFA: { lv: 3, s: 'Run by a military junta and losing large areas to jihadist groups.', e: 'One of the world’s most neglected crises, with millions displaced. Gold is the main export.' },
  NER: { lv: 3, s: 'Run by a military junta since 2023 that expelled French and US troops.', e: 'Seized a French-run uranium mine. Jihadist attacks are frequent.' },
  TCD: { lv: 2, s: 'A Sahel state hosting over a million refugees from Sudan’s war.', e: 'Oil exports and aid keep the state afloat. It ended its defence pact with France and has sent troops to Haiti.' },
  SEN: { s: 'One of West Africa’s most stable democracies.', e: 'Began oil and gas production in 2024, but the discovery of hidden debt left by the previous government triggered a financial crisis and a halt in IMF lending.' },
  GMB: { s: 'A small West African state surrounded by Senegal.', e: 'Tourism and remittances drive the economy.' },
  GNB: { lv: 2, s: 'A coup-prone West African state where the military seized power in November 2025 after an election.', e: 'A transit point for cocaine heading to Europe, and dependent on cashew exports.' },
  GIN: { s: 'Holds the world’s largest bauxite reserves. Coup leader Mamady Doumbouya was elected president in December 2025.', e: 'The giant Simandou iron ore mine, backed by Chinese firms and Rio Tinto, started exports in 2025.' },
  SLE: { s: 'A West African state rebuilding after a 1990s civil war.', e: 'Mining of iron ore and diamonds, with high poverty.' },
  LBR: { s: 'Africa’s oldest republic, founded by freed American slaves.', e: 'Rubber, iron ore and the world’s largest ship registry.' },
  CIV: { s: 'The world’s largest cocoa producer and one of Africa’s fastest-growing economies.', e: 'President Ouattara won a fourth term in October 2025 after main rivals were barred. Cocoa prices drive the economy.' },
  GHA: { s: 'A stable democracy and Africa’s top gold producer.', e: 'Recovering from a 2022 debt default with an IMF programme. Record gold prices have helped.' },
  TGO: { s: 'A small West African state ruled by the same family since 1967.', e: 'A port economy. Constitutional changes let the leader stay in power indefinitely, sparking protests.' },
  BEN: { s: 'A West African democracy that faces growing jihadist attacks in the north.', e: 'Cotton and transit trade with Nigeria. Authorities said they foiled a coup attempt in December 2025.' },
  CMR: { lv: 2, s: 'Ruled by Paul Biya, the world’s oldest head of state, since 1982. His re-election in October 2025 led to deadly protests.', e: 'Oil, cocoa and timber. Separatist conflict in English-speaking regions and Boko Haram in the north.' },
  CAF: { lv: 2, s: 'One of the world’s poorest countries, where Russian Wagner fighters protect the government.', e: 'Diamonds and gold. Armed groups control much of the countryside.' },
  GNQ: { s: 'A small oil state ruled by the same president since 1979.', e: 'Oil wealth concentrated in a narrow elite.' },
  GAB: { s: 'An oil and manganese producer where coup leader Brice Oligui Nguema was elected president in 2025.', e: 'Oil provides most revenue, and debt is high.' },
  COG: { s: 'An oil-producing state ruled by Denis Sassou Nguesso for most of the past four decades.', e: 'Heavily indebted, including to China and oil traders.' },
  /* ---- East and Southern Africa ---- */
  SSD: { lv: 2, s: 'The world’s youngest country, slipping back toward civil war after First Vice-President Riek Machar was arrested and put on trial in 2025.', e: 'Oil is almost the only export, and Sudan’s war damaged the pipeline it relies on.' },
  SOM: { lv: 3, s: 'Fighting the al-Qaeda-linked al-Shabaab, which controls much of the countryside.', e: 'Depends on remittances and livestock. An African Union force supports the government.' },
  SOL: { lv: 1, s: 'Somaliland, a self-declared state in northern Somalia that has run itself since 1991 and is seeking international recognition.', e: 'Its port of Berbera draws interest from the UAE, Ethiopia and the US.' },
  DJI: { s: 'A tiny state on the Bab-el-Mandeb strait hosting US, Chinese, French and Japanese military bases.', e: 'Earns money from ports and base rents, and handles most of Ethiopia’s trade.' },
  KEN: { lv: 1, s: 'East Africa’s largest economy and a regional diplomatic hub.', e: 'Heavy debt has forced tax rises that triggered deadly Gen Z protests in 2024 and 2025. Elections are due in 2027.' },
  UGA: { s: 'Ruled by Yoweri Museveni since 1986, who won another term in January 2026.', e: 'Starting oil production with a pipeline to Tanzania. Opposition figures face harsh crackdowns.' },
  TZA: { lv: 1, s: 'An East African state where the October 2025 election, won by the incumbent with a reported 98%, ended in a deadly crackdown on protests.', e: 'Tourism, gold and a growing gas sector.' },
  BDI: { s: 'One of the world’s poorest countries, with troops in eastern Congo opposing M23.', e: 'Severe fuel and currency shortages.' },
  MOZ: { lv: 2, s: 'Facing an Islamic State-linked insurgency in Cabo Delgado and unrest after disputed 2024 elections.', e: 'TotalEnergies’ giant LNG project, halted by the insurgency in 2021, is restarting.' },
  MDG: { lv: 2, s: 'A large island where Gen Z protests over water and power cuts led to a military takeover in October 2025.', e: 'One of the world’s poorest countries, and the top producer of vanilla.' },
  MWI: { s: 'A landlocked southern African state that returned former president Peter Mutharika to power in 2025.', e: 'Severe fuel and foreign-currency shortages and high inflation.' },
  ZMB: { s: 'Africa’s second-largest copper producer.', e: 'Restructured its debt after a 2020 default. Copper demand for EVs and power grids is a big opportunity.' },
  ZWE: { s: 'Ruled by ZANU-PF since independence in 1980.', e: 'Currency crises have repeatedly wiped out savings. It mines lithium and platinum.' },
  AGO: { s: 'One of Africa’s biggest oil producers. It left OPEC in 2024.', e: 'Heavily indebted to China, and fuel price protests turned deadly in 2025. The US-backed Lobito rail corridor aims to export Congo and Zambia’s minerals.' },
  NAM: { s: 'A stable democracy that elected its first woman president in 2024.', e: 'Mining of diamonds and uranium, with big offshore oil finds.' },
  BWA: { s: 'One of Africa’s most stable democracies, which voted out its long-ruling party in 2024.', e: 'Diamonds supply most exports, and a slump in diamond prices caused by lab-grown stones has hurt badly.' },
  LSO: { s: 'A small mountain kingdom surrounded by South Africa.', e: 'Its clothing exports to the US were hit by tariffs, threatening tens of thousands of jobs.' },
  SWZ: { s: 'Africa’s last absolute monarchy.', e: 'Closely tied to South Africa. It accepted deportees from the US in 2025.' },
  /* ---- Americas ---- */
  COL: { lv: 2, s: 'Latin America’s fourth-largest economy, where armed groups and drug traffickers are expanding despite peace efforts.', e: 'Oil, coal and coffee exports. Relations with Washington were strained under outgoing President Gustavo Petro, and a new president took office in August 2026.' },
  PER: { lv: 1, s: 'A copper and gold giant with chronic political instability. It has had seven presidents in under a decade.', e: 'Mining keeps the economy growing despite the turmoil. A new president was elected in 2026 after Gen Z protests helped force out the previous one in 2025.' },
  CHL: { s: 'The world’s largest copper producer, which elected a hard-right president in December 2025.', e: 'Copper and lithium make Chile central to the energy transition. Crime and immigration drove the shift to the right.' },
  ECU: { lv: 2, s: 'A once-peaceful country now fighting powerful drug gangs.', e: 'Uses the US dollar as its currency. The government has declared repeated states of emergency, and voters rejected allowing foreign military bases in 2025.' },
  BOL: { s: 'A landlocked Andean state with huge lithium reserves that ended two decades of left-wing MAS rule in 2025.', e: 'In crisis, with fuel and dollar shortages after gas exports collapsed.' },
  PRY: { s: 'A South American state and one of the few that recognises Taiwan.', e: 'Soybeans, beef and cheap hydropower.' },
  URY: { s: 'One of Latin America’s most stable and prosperous democracies.', e: 'Beef, pulp and soy exports.' },
  GUY: { lv: 1, s: 'A small South American country transformed by a huge offshore oil boom, and claimed in part by Venezuela.', e: 'Guyana’s economy has grown faster than any in the world in recent years, thanks to ExxonMobil-led oil fields.' },
  SUR: { s: 'A small South American state preparing for its first big offshore oil production.', e: 'TotalEnergies’ offshore project is due to start in 2028.' },
  PAN: { s: 'Home of the Panama Canal, where about 5% of world sea trade passes.', e: 'Trump’s demands over the canal led a Hong Kong firm to agree to sell its port operations there. Droughts have limited canal traffic at times.' },
  CRI: { s: 'Central America’s most stable democracy, now facing a rise in drug violence.', e: 'Tourism and medical-device exports.' },
  NIC: { s: 'An authoritarian state ruled jointly by Daniel Ortega and his wife Rosario Murillo.', e: 'Has stripped critics of citizenship and shut down thousands of civil groups.' },
  HND: { s: 'A Central American state with high violence and migration, after a close, disputed 2025 election.', e: 'Relies on remittances from the US and on garment exports.' },
  SLV: { s: 'Run by Nayib Bukele, whose mass gang crackdown has made it far safer but suspended many civil rights.', e: 'Holds prisoners deported from the US. Bitcoin was adopted as legal tender in 2021, later scaled back under an IMF deal.' },
  GTM: { s: 'Central America’s largest economy.', e: 'Remittances from the US are about a fifth of GDP, so US deportation policy matters greatly.' },
  BLZ: { s: 'A small English-speaking state on the Caribbean coast, with a long-running border claim by Guatemala.', e: 'Tourism and farming.' },
  CUB: { lv: 1, s: 'A communist one-party state in its worst economic crisis since the 1990s.', e: 'Nationwide blackouts, food shortages and mass emigration. The fall of Maduro cut off its main source of subsidised oil.' },
  JAM: { s: 'A Caribbean democracy that cut its debt dramatically.', e: 'Tourism and remittances. Hurricane Melissa caused severe damage in October 2025.' },
  HTI: { lv: 3, s: 'Gangs control most of the capital, Port-au-Prince.', e: 'The economy has shrunk for years, and more than a million people are displaced. A UN-backed Gang Suppression Force began operations in 2026.' },
  DOM: { s: 'The Caribbean’s largest economy and one of its fastest-growing.', e: 'Tourism, mining and free-trade zones. It has deported large numbers of Haitians.' },
  PRI: { s: 'A US territory whose residents are US citizens but cannot vote for president.', e: 'Recovering from a 2017 debt restructuring and hurricane damage.' },
  TTO: { s: 'A Caribbean energy producer close to Venezuela.', e: 'Gas and petrochemicals, and it hoped to develop gas fields shared with Venezuela.' },
  BHS: { s: 'A Caribbean archipelago close to Florida.', e: 'Tourism and offshore finance.' },
  FLK: { s: 'A British overseas territory also claimed by Argentina.', e: 'Fishing and a planned offshore oil project.' },
  /* ---- Oceania ---- */
  NZL: { s: 'A stable Pacific democracy and Five Eyes intelligence partner.', e: 'Dairy, meat and tourism. It slipped into recession in 2024 and has been slow to recover.' },
  PNG: { s: 'The largest Pacific island nation, courted by both Australia and China.', e: 'Gas, gold and copper, with high crime and tribal violence. It signed a defence treaty with Australia in 2025.' },
  FJI: { s: 'A Pacific island hub.', e: 'Tourism and sugar.' },
  SLB: { s: 'A Pacific island state that signed a security pact with China in 2022.', e: 'Logging and fishing.' },
  VUT: { s: 'A Pacific island state vulnerable to cyclones and rising seas.', e: 'Tourism, and it sells citizenship to foreign investors.' },
  NCL: { lv: 1, s: 'A French Pacific territory where deadly riots broke out in 2024 over voting rights and independence.', e: 'Holds a large share of the world’s nickel, but its industry is in crisis.' },
  ATA: { s: 'Antarctica is governed by the 1959 Antarctic Treaty, which bans military activity and mining. Seven countries claim parts of it.', e: '' },
  ATF: { s: 'French Southern and Antarctic Lands, remote islands administered by France.', e: '' },
  /* ---- extra economy notes for briefed countries ---- */
  ARM_: {}
});
delete BRIEF.ARM_;
