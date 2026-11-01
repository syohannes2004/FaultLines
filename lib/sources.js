/* Outlets shown in the live news feeds. Matched against the article's source domain.
   Broad on purpose: established newspapers, wire services, broadcasters and specialist outlets.
   State-controlled outlets (RT, TASS, Xinhua, CGTN, Press TV) are left out. */
export const TRUSTED = [
  // wires and global
  'reuters.com', 'apnews.com', 'afp.com', 'bloomberg.com', 'ft.com', 'economist.com', 'wsj.com',
  // UK / Europe
  'bbc.com', 'bbc.co.uk', 'theguardian.com', 'independent.co.uk', 'telegraph.co.uk', 'news.sky.com', 'sky.com', 'thetimes.com', 'thetimes.co.uk',
  'dw.com', 'france24.com', 'rfi.fr', 'lemonde.fr', 'euronews.com', 'politico.eu', 'spiegel.de', 'elpais.com', 'irishtimes.com',
  'kyivindependent.com', 'themoscowtimes.com', 'meduza.io', 'rferl.org', 'balkaninsight.com', 'notesfrompoland.com',
  // North America
  'nytimes.com', 'washingtonpost.com', 'npr.org', 'pbs.org', 'cnn.com', 'nbcnews.com', 'cbsnews.com', 'abcnews.go.com', 'abcnews.com',
  'foxnews.com', 'usatoday.com', 'latimes.com', 'politico.com', 'axios.com', 'thehill.com', 'semafor.com', 'time.com', 'theatlantic.com',
  'newyorker.com', 'foreignpolicy.com', 'foreignaffairs.com', 'cnbc.com', 'marketwatch.com', 'barrons.com', 'fortune.com', 'businessinsider.com',
  'theverge.com', 'techcrunch.com', 'wired.com', 'arstechnica.com', 'voanews.com', 'csmonitor.com', 'propublica.org', 'vox.com',
  'cbc.ca', 'theglobeandmail.com', 'ctvnews.ca', 'globalnews.ca', 'nationalpost.com', 'thestar.com', 'financialpost.com',
  // Middle East
  'aljazeera.com', 'aljazeera.net', 'timesofisrael.com', 'haaretz.com', 'jpost.com', 'ynetnews.com', 'thenationalnews.com', 'arabnews.com',
  'al-monitor.com', 'middleeasteye.net', 'iranintl.com', 'aawsat.com', 'english.aawsat.com', 'lorientlejour.com', 'dailysabah.com',
  // Asia-Pacific
  'scmp.com', 'nikkei.com', 'asia.nikkei.com', 'japantimes.co.jp', 'straitstimes.com', 'channelnewsasia.com', 'koreaherald.com', 'koreatimes.co.kr',
  'yna.co.kr', 'taipeitimes.com', 'focustaiwan.tw', 'thehindu.com', 'hindustantimes.com', 'indianexpress.com', 'ndtv.com', 'livemint.com',
  'dawn.com', 'tribune.com.pk', 'thediplomat.com', 'abc.net.au', 'smh.com.au', 'theage.com.au', 'rnz.co.nz', 'nzherald.co.nz',
  'bangkokpost.com', 'irrawaddy.com', 'rappler.com', 'inquirer.net', 'thestar.com.my', 'jakartaglobe.id', 'thejakartapost.com',
  // Africa
  'africanews.com', 'news24.com', 'dailymaverick.co.za', 'nation.africa', 'theeastafrican.co.ke', 'premiumtimesng.com', 'thecitizen.co.tz',
  'addisstandard.com', 'sudantribune.com', 'radiotamazuj.org', 'monitor.co.ug', 'businessday.ng', 'theafricareport.com', 'allafrica.com',
  // Latin America
  'mercopress.com', 'buenosairesherald.com', 'batimes.com.ar', 'riotimesonline.com', 'mexiconewsdaily.com', 'insightcrime.org', 'elpais.com',
  'americasquarterly.org', 'bnamericas.com', 'latimes.com',
  // specialist
  'crisisgroup.org', 'understandingwar.org', 'criticalthreats.org', 'defensenews.com', 'breakingdefense.com', 'navalnews.com',
  'gcaptain.com', 'lloydslist.com', 'oilprice.com', 'theconversation.com', 'devex.com', 'thenewhumanitarian.org', 'reliefweb.int', 'news.un.org'
];

export function isTrusted(host) {
  if (!host) return false;
  const h = host.toLowerCase().replace(/^www\./, '');
  return TRUSTED.some(d => h === d || h.endsWith('.' + d));
}
