import { useState, useCallback, useMemo } from "react";

const DATA = {
  periods: [
    { id: "pre", label: "Pre-Colonial", color: "#8B6914", years: "Before 1565" },
    { id: "spain", label: "Spanish Era", color: "#C4451C", years: "1565–1898" },
    { id: "usa", label: "American Era", color: "#2D6A9F", years: "1898–1946" },
    { id: "japan", label: "Japanese Occupation", color: "#7A3B5E", years: "1942–1945" },
    { id: "post", label: "Post-Independence", color: "#2E7D5B", years: "1946–Present" },
  ],

  roots: [
    { id: "r1", period: "pre", title: "Barangay System", desc: "Small, autonomous communities led by datus. Loyalty was hyper-local — to your kin group and chief, not to a nation. Alliances were personal, not institutional." },
    { id: "r2", period: "pre", title: "Utang na Loob (Debt of Gratitude)", desc: "Pre-colonial reciprocal obligation system. When someone helps you, you owe them — not money, but loyalty and future favors. This predates Spain and is Austronesian in origin." },
    { id: "r3", period: "pre", title: "Animist Spirituality", desc: "A world filled with spirits (anito/diwata) that demanded respect and ritual. Nature was alive and negotiations with invisible forces were part of daily life." },
    { id: "r4", period: "spain", title: "Friar Control of Towns", desc: "Parish priests became de facto local government. They controlled education, records, morality, and even land disputes. The church bell, not a government office, organized Filipino life." },
    { id: "r5", period: "spain", title: "Encomienda & Hacienda System", desc: "Spaniards were granted rights to Filipino labor and tribute. Later evolved into haciendas — massive landed estates. Created a landless peasant class that persists today." },
    { id: "r6", period: "spain", title: "Racial Caste System (Indio/Mestizo)", desc: "Filipinos were classified as 'indios' — lowest caste. Social mobility required mixed blood or wealth. This embedded a hierarchy of skin color and foreign association into culture." },
    { id: "r7", period: "spain", title: "Ilustrado Class Emergence", desc: "Wealthy Filipino-mestizo families sent sons to Europe. They returned with revolutionary ideas but also became the new elite. The pattern: reformers who reproduce the hierarchy they fought." },
    { id: "r8", period: "spain", title: "Tobacco Monopoly (Ilocos)", desc: "Spain forced Ilocanos to grow tobacco exclusively, buying it at fixed low prices. Created extreme poverty but also forged Ilocano identity around endurance, thrift, and quiet resistance." },
    { id: "r19", period: "spain", title: "Silang Revolt (1762–1763)", desc: "Diego Silang seized Vigan during the British occupation of Manila and declared 'Free Ilocos' — the first Ilocano bid for self-rule. He abolished tribute taxes and forced labor. Assassinated by a mestizo friend paid by the friars. His wife Gabriela continued the fight from Abra with Tinguian allies before being captured and hanged in Vigan's plaza. The revolt showed Ilocanos that liberation was possible — and that betrayal comes from within." },
    { id: "r20", period: "spain", title: "Basi Revolt (1807)", desc: "After Spain banned private basi (sugarcane wine) production in 1786 — attacking an Ilocano cultural sacrament used in birth, marriage, and death rituals — Pedro Mateo and Saralogo Ambaristo led Piddig in revolt. Rebels swept through Sarrat, Laoag, Batac, marching toward Vigan. Crushed at the Gongogong river in San Ildefonso after 13 days. Leaders hanged in Plaza Salcedo, survivors exiled to Mindoro. Spain split Ilocos into Norte and Sur to prevent future unity." },
    { id: "r9", period: "usa", title: "Benevolent Assimilation & Public Schools", desc: "Americans built a public school system — taught in English, with American textbooks and values. Created a generation that saw America as the model of progress and modernity." },
    { id: "r10", period: "usa", title: "Pensionado Program", desc: "Filipino scholars sent to U.S. universities on government scholarships. They returned as technocrats who modeled American professional culture — the origin of the 'study abroad' aspiration." },
    { id: "r11", period: "usa", title: "Philippine-American War Brutality", desc: "200,000–1,000,000 Filipino civilian deaths. Torture, concentration camps, scorched earth. Then deliberately erased from both countries' popular history. A foundational national amnesia." },
    { id: "r12", period: "usa", title: "Commonwealth & Mock Independence", desc: "The U.S. created a Philippine Commonwealth with Filipino leaders — but retained ultimate control. Trained Filipinos to administer their own subjugation, normalizing performative sovereignty." },
    { id: "r13", period: "japan", title: "WWII Occupation Trauma", desc: "Mass atrocities, Bataan Death March, Manila Massacre. Survival required deception, submission, or guerrilla resistance. Communities were forced to choose between collaboration and death." },
    { id: "r14", period: "japan", title: "Guerrilla Resistance Networks", desc: "Filipinos built underground resistance movements — often family and barangay-based. This reinforced the pattern of trusting only your immediate circle in times of crisis." },
    { id: "r15", period: "post", title: "Failed Land Reform", desc: "Every post-independence president promised land reform; none delivered fully. The hacienda class retained power. The landless remained landless. Institutional promises became meaningless." },
    { id: "r16", period: "post", title: "Marcos Dictatorship & EDSA", desc: "14 years of martial law, cronyism, and plunder — followed by a People Power revolution that restored democracy but not economic justice. The cycle: hope, betrayal, resignation." },
    { id: "r17", period: "post", title: "Labor Export Policy (OFW)", desc: "Government institutionalized overseas labor migration as economic strategy. Millions left families behind. Remittances became a national lifeline — and a substitute for domestic development." },
    { id: "r18", period: "post", title: "Dynastic Politics", desc: "The ilustrado pattern reproduced: political families control provinces across generations. Elections become choices between dynasties, not ideologies." },
    // Regional roots
    { id: "r21", period: "pre", title: "Visayan Pintados Warrior Culture", desc: "Pre-colonial Visayans were seafarers, raiders, and warriors whose full-body tattoos (batok) earned them the Spanish name 'Pintados' — the painted ones. Tattoos marked bravery and social rank. A maritime people with extensive Asian trade networks, skilled shipbuilders, and a culture that valued combat prowess, feasting, and oral epics." },
    { id: "r22", period: "pre", title: "Moro Sultanates (Mindanao/Sulu)", desc: "Islam reached Sulu and Maguindanao before Spain arrived. The Sultanate of Sulu and Sultanate of Maguindanao were organized Islamic states with written law, international trade with Borneo and China, and a warrior tradition. They resisted Spain for 300+ years and were never fully conquered — the only region in the Philippines that maintained sovereignty throughout colonial rule." },
    { id: "r23", period: "pre", title: "Cordillera Igorot Autonomy", desc: "The mountain peoples of the Cordillera — Bontoc, Ifugao, Kalinga, Kankanaey, Ibaloi, Tinguian — built the Banaue Rice Terraces over 2,000 years ago. They successfully resisted Spanish colonization for three centuries using mountainous terrain and fierce warrior traditions. They governed through indigenous law (bodong peace pacts) and were never Christianized during Spanish rule." },
    { id: "r24", period: "spain", title: "Kapampangan Soldier-Collaborators", desc: "Spain recruited Kapampangan warriors as colonial soldiers — they fought against the Moros, suppressed Ilocano revolts (including the Silang Revolt), and served as the military backbone of Spanish control. This 'collaboration' gave Kapampangans access to land, privileges, and power — but also made them instruments of colonial violence against fellow Filipinos." },
    { id: "r25", period: "spain", title: "Negros Sugar Hacienda Economy", desc: "Western Visayas, especially Negros Occidental, became the center of the Philippine sugar industry under Spain. Massive haciendas worked by sacadas (migrant sugar workers) created extreme wealth for a few families and grinding poverty for laborers. The sugar barons became a political dynasty class that persists today — Negros produced some of the Philippines' most powerful oligarchs." },
    { id: "r26", period: "spain", title: "Moro Wars & Slave Raids (Visayas)", desc: "For centuries, Moro raiders from Sulu and Maguindanao attacked Visayan coastal towns, capturing thousands as slaves. Spain used these raids to justify military campaigns and to deepen Christian-Muslim animosity. Visayan communities built watchtowers (bantayan) and developed a siege mentality. The mutual violence created a Christian-Muslim divide that Spain exploited and that persists today." },
    { id: "r27", period: "spain", title: "Cavite-Batangas Revolutionary Heartland", desc: "Southern Tagalog — Cavite, Batangas, Laguna — became the cradle of Philippine revolution. The Katipunan was founded in Cavite. Batangas endured some of the worst American war atrocities. These provinces developed a fierce revolutionary identity and a tradition of political dissent that other regions lacked." },
    { id: "r28", period: "usa", title: "Mindanao Settler Colonialism", desc: "The American Homestead Act, then post-independence government policy under Roxas, Quirino, and Magsaysay, resettled waves of Christian Filipinos — Visayans, Ilocanos — into Mindanao. This deliberately changed demographics, displacing Moro and Lumad communities from their ancestral lands. By the 1970s, Christians outnumbered Muslims on their own island." },
    { id: "r29", period: "post", title: "Typhoon Belt Identity (Eastern Visayas)", desc: "Samar and Leyte sit in the path of the Pacific typhoon belt. Yolanda/Hainan (2013) killed 6,000+ and destroyed Tacloban. But catastrophic storms have hit Eastern Visayas for centuries, creating a regional identity built around rebuilding, communal survival, and a dark humor about impermanence. Waray resilience is not metaphorical — it's annual." },
    { id: "r30", period: "post", title: "Marcos Cordillera Dam Resistance", desc: "In the 1970s-80s, Marcos planned the Chico River Dam project that would have submerged Bontoc and Kalinga rice terraces and communities. Kalinga elder Macli-ing Dulag organized tribal resistance and was assassinated by the military in 1980. His death became a turning point — uniting Cordillera tribes into a collective Igorot political identity for the first time." },
    { id: "r31", period: "post", title: "Bangsamoro Struggle for Self-Determination", desc: "The Jabidah Massacre (1968), Marcos martial law, and decades of marginalization fueled the MNLF and MILF armed struggles. After 120,000+ deaths and decades of conflict, the Bangsamoro Autonomous Region (BARMM) was established in 2019. The Moro conflict is the Philippines' longest-running insurgency — and a direct consequence of centuries of resistance being met with centuries of suppression." },
    // Chinese influence
    { id: "r32", period: "pre", title: "Pre-Colonial Chinese Trade (10th–16th c.)", desc: "Chinese traders from Fujian were trading with Philippine barangays centuries before Spain arrived. Archaeological finds of Song Dynasty ceramics (960–1279) prove deep commercial ties. Filipino envoys even traveled to China to request direct trade. This was a relationship of equals — not colonizer and colonized — based on porcelain, silk, beeswax, and gold." },
    { id: "r33", period: "spain", title: "Sangley Merchants & the Parian", desc: "When Spain colonized Manila in 1571, Chinese (Hokkien) merchants were already there. The Spanish called them 'Sangley' (from Hokkien 'siong-lai' — one who comes frequently). Confined to the Parian ghetto near Intramuros, they became the colonial economy's backbone: artisans, retailers, builders, craftsmen. Spain needed them economically but feared their numbers — leading to periodic massacres (1603, 1639, 1662, 1686) that killed tens of thousands." },
    { id: "r34", period: "spain", title: "Chinese Mestizo Class & Ilustrados", desc: "Chinese men married Filipino women, producing the 'mestizo de sangley' class. These Chinese mestizos — with access to both Chinese commercial networks and Spanish colonial privileges — became the educated, landowning elite. José Rizal, the national hero, was classified as mestizo de sangley. The ilustrado class that sparked the Philippine revolution was substantially Chinese-mestizo." },
    { id: "r35", period: "spain", title: "Chinese Retail & the Sari-Sari Store Origin", desc: "Chinese traders pioneered small-scale retail in the Philippines — the tiendas that became the sari-sari store. They dominated neighborhood retail for centuries, with far larger inventories and higher efficiency than Filipino-owned stores. The 1959 Retail Trade Nationalization Act forced Chinese owners out, but Filipinos inherited the model — and many Chinese simply put stores under their Filipino wives' names." },
    { id: "r36", period: "post", title: "Tsinoy Economic Dominance", desc: "Today, Chinese Filipinos (Tsinoy) — roughly 1.5% of the population — dominate the Philippine economy. Most of the country's richest families are of Chinese descent: the Sys, Tans, Gokongweis, Cojuangcos. They control retail (SM), banking (BDO/Metrobank), real estate, and food manufacturing. This concentration of wealth traces directly from Sangley commercial networks through Chinese mestizo capital accumulation to modern conglomerate empires." },
    { id: "r37", period: "pre", title: "Chinese Cultural Absorption into Daily Life", desc: "Filipino daily life is saturated with Chinese influence most Filipinos don't recognize: pancit (Hokkien: 'pian-sit', ready-made food), siopao, lumpia, soy sauce, toyo. The word 'kuya' (older brother) comes from Hokkien. Beliefs in feng shui, lucky numbers, round fruits at New Year, tikoy — all Chinese. Even the suki (preferred customer) system has Chinese merchant roots. The absorption was so complete it became invisible." },
  ],

  behaviors: [
    { id: "b1", title: "Pakikisama (Smooth Relations)", desc: "The deep need to maintain social harmony, avoid open conflict, and go along with the group — even at personal cost." },
    { id: "b2", title: "Hiya (Shame Sensitivity)", desc: "Acute awareness of social embarrassment — both for yourself and others. Drives indirectness, avoidance of confrontation, and elaborate face-saving." },
    { id: "b3", title: "Bahala Na (Fatalism)", desc: "'Leave it to God/fate.' Often misread as laziness, but functions as a coping mechanism when you've learned that planning doesn't protect you from powerful forces." },
    { id: "b4", title: "Colonial Mentality", desc: "Preference for foreign (especially American) products, culture, skin color, and validation. The internalized belief that Filipino-made is inferior." },
    { id: "b5", title: "Family-Over-Institution Trust", desc: "Trusting family networks over government, banks, or legal systems. Business is personal. Contracts are secondary to relationships." },
    { id: "b6", title: "OFW Sacrifice Culture", desc: "The normalization of family separation for economic survival. Parents leaving children is heroic, not tragic. Remittance = love." },
    { id: "b7", title: "Patronage & Utang na Loob in Politics", desc: "Voting for candidates who gave you something (a job, money, a favor) rather than based on policy. Political loyalty as personal debt." },
    { id: "b8", title: "Entrepreneurial but Small-Scale", desc: "Filipinos are intensely entrepreneurial (sari-sari stores, side hustles) but rarely scale. Structural barriers and distrust of institutions keep businesses family-sized." },
    { id: "b9", title: "Resilience / 'Diskarte'", desc: "The ability to improvise, adapt, and find creative solutions with limited resources. Born from centuries of navigating systems not designed for you." },
    { id: "b10", title: "Religious Devotion as Community", desc: "Deep Catholic faith that functions as social infrastructure — fiestas, processions, novenas create belonging and mark time in ways that government never did." },
    { id: "b11", title: "Crab Mentality", desc: "Pulling down those who rise above the group. Often blamed on individual character, but rooted in systems where someone's gain historically meant your loss." },
    { id: "b12", title: "Skin Color Hierarchy", desc: "Preference for lighter skin, association of darkness with poverty/labor. Papaya soap, glutathione, 'mestizo' as compliment." },
    { id: "b13", title: "Distrust of Institutions", desc: "Low faith in government, courts, police, and formal systems. 'The system doesn't work for people like us.' Learned from centuries of institutional betrayal." },
    { id: "b14", title: "Ilocano Work Ethic & Thrift", desc: "The specific Ilocano reputation for hard work, frugality, and migration. Distinct from the national average and traceable to specific colonial pressures." },
    { id: "b15", title: "Betrayal from Within", desc: "A deep wariness that the person closest to you — the friend, the ally, the compadre — could be the one who destroys you. Trust given slowly, withdrawn quickly." },
    { id: "b16", title: "Manila-Centric Historical Amnesia", desc: "National history is written from Manila's perspective. Provincial revolts, regional resistance, and local heroism are compressed into footnotes — or forgotten entirely." },
    { id: "b17", title: "Women as Last-Resort Leaders", desc: "Filipino women step into leadership when men fall — in families, businesses, and historically in revolts. Respected but only empowered by crisis, not by design." },
    { id: "b18", title: "Divide-and-Rule Internalized", desc: "Regionalism, linguistic tribalism, and inter-ethnic suspicion that traces to colonial strategies of using one group to suppress another. Kapampangan vs. Ilocano, Tagalog vs. Bisaya." },
    { id: "b19", title: "Christian-Muslim Divide", desc: "Deep mutual suspicion between Christian and Muslim Filipinos. Christians see Moros as separatists or terrorists; Moros see Christians as colonizers on stolen land. Both views have historical roots spanning centuries." },
    { id: "b20", title: "Visayan Humor & Fiesta Culture", desc: "The Visayan reputation for being happy-go-lucky, fun-loving, and generous to a fault — spending the last peso on a celebration. Often dismissed as frivolous, but rooted in a maritime culture where you share the catch because tomorrow the sea decides." },
    { id: "b21", title: "Regional Pride / Ethno-Linguistic Identity", desc: "Fierce identification with province or language group — 'Ilonggo ako,' 'Waray ako,' 'Ilocano ako' — often stronger than national identity. Each group has distinct stereotypes, humor, and in-group solidarity." },
    { id: "b22", title: "Oligarch-Controlled Provincial Economies", desc: "Entire provincial economies dominated by a handful of families — sugar in Negros, coconut in Quezon, tobacco in Ilocos. Economic diversification never happened because landed elites blocked it." },
    { id: "b23", title: "Tagalog/Manila Centrism as 'Filipino'", desc: "Tagalog culture, language, and perspectives treated as default 'Filipino' — marginalizing Visayan, Ilocano, Moro, and Cordillera identities. National language policy, media, and government are all Manila-centric." },
    { id: "b24", title: "Indigenous Land Defense", desc: "Continuing resistance of IP communities — Lumad, Igorot, Mangyan, Moro — against mining, logging, dams, and land grabs. Ancestral domain is not abstract; it's the hill your grandfather is buried in." },
    { id: "b25", title: "Suki System & Relational Commerce", desc: "The Filipino preference for buying from 'your' vendor — your suki — rather than shopping for the best price. Loyalty, credit, and personal relationship embedded in every transaction. Commerce as social bond, not anonymous exchange." },
    { id: "b26", title: "Wealth-Ethnicity Tension", desc: "The perception that 'the Chinese own everything' while 'real Filipinos' stay poor. A resentment that flares in anti-Chinese sentiment but masks the structural reality: wealth concentration was built into the colonial system, not caused by ethnicity." },
    { id: "b27", title: "Invisible Cultural Borrowing", desc: "Filipinos practice Chinese-origin customs — lucky money, round fruits, feng shui, tikoy — without recognizing them as Chinese. The absorption is so deep it feels 'naturally Filipino.' This invisible borrowing is both a testament to integration and a form of cultural amnesia." },
    { id: "b28", title: "Tingi Culture (Sachet Economy)", desc: "Buying in small portions — single-use sachets of shampoo, one cigarette, a tablespoon of cooking oil. Born from poverty but also from the Chinese-pioneered sari-sari model of breaking bulk goods into affordable micro-units. A retail innovation that became a national economic pattern." },
  ],

  connections: [
    { from: "r1", to: "b5", insight: "The barangay was your world — 30-100 families. Trust was face-to-face. When colonizers built 'institutions,' they were alien impositions. Family trust isn't a flaw — it's the original operating system." },
    { from: "r1", to: "b7", insight: "Datu leadership was personal, not institutional. You followed a leader because of your relationship with them, not their office. This pattern maps directly onto modern patronage politics." },
    { from: "r2", to: "b7", insight: "Utang na loob predates Spain. When a politician gives you a job, the obligation to repay with loyalty isn't corruption in the Filipino framework — it's the oldest social contract in the culture." },
    { from: "r2", to: "b1", insight: "Reciprocal obligation requires constant social maintenance. You must track who owes what to whom. Pakikisama isn't just 'being nice' — it's managing a complex web of debts and credits." },
    { from: "r3", to: "b10", insight: "Catholicism didn't replace animism — it merged with it. Santo Niño devotion, faith healing, the Ati-Atihan festival — these are syncretic. Filipino religiosity has pre-colonial roots wrapped in Catholic form." },
    { from: "r3", to: "b3", insight: "In an animist world, you negotiate with forces beyond your control. 'Bahala na' may trace to 'Bathala na' (leave it to God) — a spiritual surrender that long predates colonial fatalism." },
    { from: "r4", to: "b2", insight: "Friars used public shaming as social control — confessional exposure, public penance, denunciation from the pulpit. Hiya became a survival reflex: don't attract the attention of those in power." },
    { from: "r4", to: "b10", insight: "The friar WAS the community. He baptized you, married you, buried you, educated your children. The church wasn't just faith — it was the only stable institution Filipinos ever knew." },
    { from: "r4", to: "b13", insight: "For 333 years, the 'government' was a foreign priest who could punish you. Institutions were never 'yours.' The reflex to distrust formal authority has very deep roots." },
    { from: "r5", to: "b8", insight: "When the best land belongs to haciendas and you have no capital, entrepreneurship stays at the sari-sari store level. It's not lack of ambition — it's lack of structural access." },
    { from: "r5", to: "b11", insight: "In a zero-sum hacienda economy, one family's gain could literally mean another's loss of land or livelihood. 'Crab mentality' makes economic sense when resources are genuinely finite." },
    { from: "r6", to: "b12", insight: "The Spanish caste system literally ranked people by blood quantum and skin color. Three centuries of 'mestizo = higher status' embedded a hierarchy that glutathione ads still exploit today." },
    { from: "r6", to: "b4", insight: "When 'indio' meant lowest-class for 333 years, and mixed foreign blood meant upward mobility, the message was clear: Filipino = inferior. Colonial mentality isn't a character flaw — it's an inheritance." },
    { from: "r7", to: "b7", insight: "The ilustrados became the new ruling class. Their descendants are today's political dynasties. The revolution changed the flag, not the structure." },
    { from: "r7", to: "b13", insight: "When the people who 'freed' you became your new landlords, the lesson was: reform is theater. This cycles through Marcos, EDSA, and every promise of change since." },
    { from: "r8", to: "b14", insight: "The tobacco monopoly crushed Ilocano farmers for over a century. The response was extreme frugality, relentless work, and migration — traits now coded as 'Ilocano character' but born from specific exploitation." },
    { from: "r9", to: "b4", insight: "American schools taught Filipino children to admire American heroes, speak English, and aspire to American standards. Colonial mentality wasn't just imposed — it was systematically educated into the culture." },
    { from: "r9", to: "b6", insight: "English fluency + American-style aspirations + limited domestic opportunities = the perfect formula for labor export. The American school system inadvertently trained a workforce for global migration." },
    { from: "r10", to: "b4", insight: "The pensionado program said: the path to success leads through America. This became deeply embedded — to this day, U.S. education is seen as the pinnacle of achievement." },
    { from: "r11", to: "b13", insight: "A war that killed hundreds of thousands of Filipinos was erased from history books in both countries. When your own suffering is denied by the powerful, why would you trust their institutions?" },
    { from: "r11", to: "b4", insight: "The most insidious colonial trick: make Filipinos love the country that brutalized them by erasing the brutality from memory and replacing it with a narrative of 'benevolence.'" },
    { from: "r12", to: "b13", insight: "The Commonwealth taught Filipino leaders to administer systems they didn't truly control. Post-independence government inherited this pattern — the forms of sovereignty without the substance." },
    { from: "r13", to: "b3", insight: "When bombs fall regardless of what you do, fatalism is rational. WWII taught an entire generation that careful planning offers no protection against overwhelming force." },
    { from: "r13", to: "b9", insight: "Survival under Japanese occupation required extreme improvisation — hiding food, forging documents, maintaining secret networks. 'Diskarte' was literally a matter of life and death." },
    { from: "r14", to: "b5", insight: "Guerrilla networks were organized around families and barangays — the people you could trust with your life. This reinforced the ancient pattern: your circle is everything, outsiders are dangerous." },
    { from: "r15", to: "b13", insight: "When every president promises land reform and none delivers, you learn that institutional promises are performances. The rational response is to stop believing in institutions." },
    { from: "r15", to: "b8", insight: "Without land reform, capital stays concentrated. Without capital access, businesses stay small. The sari-sari store economy is a direct consequence of unreformed land ownership." },
    { from: "r16", to: "b3", insight: "EDSA proved people power works — then the same families returned to power. The lesson: even successful revolution doesn't change the game. Bahala na becomes the only rational stance." },
    { from: "r16", to: "b13", insight: "Marcos plundered billions while institutions (courts, military, congress) enabled him. EDSA restored democracy but not accountability. Trust in institutions never recovered." },
    { from: "r17", to: "b6", insight: "When government makes labor export the national economic strategy, family separation becomes patriotic duty. The OFW isn't just an individual choice — it's state policy dressed as heroism." },
    { from: "r17", to: "b5", insight: "OFW communities abroad reproduce barangay-scale networks — hometown associations, church groups, remittance circles. Filipino social technology travels because it works." },
    { from: "r18", to: "b7", insight: "When the same families control politics for generations, voting becomes about which patron you're aligned with, not which policy you prefer. Patronage isn't a bug — it's the system working as designed." },
    { from: "r18", to: "b11", insight: "When upward mobility requires connection to a dynasty, and dynasties have limited slots, competition becomes personal and zero-sum. Crab mentality is rational in a patronage economy." },
    // Silang Revolt connections
    { from: "r19", to: "b15", insight: "Diego Silang was assassinated by his friend Miguel Vicos — paid by the friars — while offering him basi as a gesture of trust. The deepest betrayal came from inside the circle. This pattern echoes in Filipino wariness of allies who get too close to power." },
    { from: "r19", to: "b13", insight: "Silang tried to work within the system first — he petitioned for Ilocano participation in government. When the Spaniards refused and then had him murdered, the lesson was: the system doesn't negotiate, it eliminates. Institutional trust died in that moment." },
    { from: "r19", to: "b17", insight: "After Diego's assassination, Gabriela Silang didn't hesitate — she assumed command, rallied Tinguian allies from Abra, and fought for four more months. She became 'La Generala.' The pattern of Filipino women stepping into leadership during crisis has deep roots in Ilocos." },
    { from: "r19", to: "b18", insight: "Spain sent Kapampangan soldiers to crush the Ilocano revolt — using one colonized group to suppress another. This divide-and-rule tactic planted seeds of inter-ethnic suspicion that persist in regional rivalries today." },
    { from: "r19", to: "b9", insight: "Silang saw the British invasion of Manila and immediately recognized a strategic opening for Ilocano liberation. That instinct — reading chaos as opportunity, improvising alliances on the fly — is pure diskarte, applied at the scale of a revolution." },
    { from: "r19", to: "b16", insight: "The Silang Revolt declared an independent Ilocano state in 1762 — a century before Rizal. Yet most Filipino textbooks give it a paragraph. History is written in Manila, and provincial heroism gets compressed into footnotes." },
    // Basi Revolt connections
    { from: "r20", to: "b14", insight: "The basi monopoly (1786) came on top of the tobacco monopoly (1781). Ilocanos couldn't grow their own food, couldn't brew their own wine, couldn't profit from their own labor. The only rational responses were extreme thrift and eventual migration — both became identity." },
    { from: "r20", to: "b13", insight: "After the Basi Revolt, Spain split Ilocos into Norte and Sur specifically to prevent future unified resistance. The 'institution' didn't just fail the people — it was redesigned to weaken them. Provincial boundaries on today's map are colonial control strategies." },
    { from: "r20", to: "b10", insight: "Basi wasn't just alcohol — it was sacred. Used in birth rituals, marriage ceremonies, death rites. When Spain banned it, they weren't regulating commerce; they were severing Ilocanos from their spiritual practices. The fierce attachment to religious ritual today has roots in what happens when ritual is taken away." },
    { from: "r20", to: "b16", insight: "The Basi Revolt involved thousands of Ilocanos across multiple towns in a coordinated 13-day uprising — and most Filipinos have never heard of it. 200 years later, a UP historian noted that Philippine history is taught in a way that is 'very Manila-centric.' Regional resistance is erased." },
    { from: "r20", to: "b9", insight: "Even under the basi ban, Tinguians in eastern Ilocos Norte secretly continued brewing. Well-connected Ilocanos would sneak to their settlements at night to buy it. When the law is unjust, diskarte becomes the quiet resistance — finding workarounds rather than confrontation." },
    { from: "r20", to: "b5", insight: "The Basi Revolt was organized through barangay and family networks — Pedro Mateo was a cabeza de barangay, Ambaristo had Tinguian kinship ties. The rebellion spread town by town through personal trust, not institutional coordination. Family networks were the revolution's infrastructure." },
    // Visayan Pintados connections
    { from: "r21", to: "b20", insight: "Pre-colonial Visayans feasted after raids, celebrated with professional bards at weddings, and valued generosity as a mark of status. The modern Visayan fiesta culture — spending lavishly, celebrating through hardship — descends from a warrior-maritime society where sharing the bounty was prestige." },
    { from: "r21", to: "b21", insight: "The Pintados had their own identity before Spain arrived — seafarers, tattooed warriors, builders of balangay boats. When the Spanish called them all 'Visayan,' they collapsed dozens of distinct identities into one label. But local identity — Cebuano, Ilonggo, Waray — endured underneath." },
    { from: "r21", to: "b9", insight: "Visayan maritime culture required constant improvisation — reading seas, negotiating trade, adapting to storms. Spanish colonizers noted that Visayan 'pandayes' (shipbuilders) were so skilled they rivaled Spanish craftsmen. Diskarte has deep Visayan roots in seafaring resourcefulness." },
    // Moro Sultanates connections
    { from: "r22", to: "b19", insight: "The Moro-Spanish conflict lasted 300+ years. Spain framed it as 'Christian civilization vs. Muslim barbarism' — and educated Christianized Filipinos to see Moros as the enemy. This framing outlived Spain: Christian-Muslim distrust in the Philippines is a colonial inheritance, not a cultural inevitability." },
    { from: "r22", to: "b13", insight: "The Moros never submitted to Spanish institutions, never accepted the Treaty of Paris, and never recognized Manila's sovereignty. When Moro leaders asked how Spain could sell land it never conquered, they exposed the fiction at the heart of Philippine nationhood — and institutional distrust was the rational response." },
    { from: "r22", to: "b24", insight: "The Moro defense of ancestral domain is the Philippines' longest continuous resistance movement — 400+ years against Spain, America, Japan, and the Philippine state. Modern IP land defense movements across the archipelago echo this: land is sovereignty, and surrendering it means extinction." },
    { from: "r22", to: "b21", insight: "Moro identity is built on never having been conquered. While Christianized Filipinos share a colonial legacy, the Bangsamoro define themselves by what they resisted. This creates a fundamentally different relationship to Filipino national identity — one that is still being negotiated through BARMM." },
    // Cordillera Igorot connections
    { from: "r23", to: "b24", insight: "Igorots resisted Spain for 300 years from their mountain strongholds, then fought American gold miners, then Marcos dams. The rice terraces aren't just agriculture — they're a physical manifestation of land defense. You don't abandon terraces your ancestors carved from mountains 2,000 years ago." },
    { from: "r23", to: "b21", insight: "Igorot identity was forged in opposition — to Spanish missionaries, to lowland stereotypes of 'savages,' to American anthropologists who displayed them at world fairs. The Cordillera's fierce regional pride is a direct response to centuries of being told they were primitive." },
    { from: "r23", to: "b5", insight: "The bodong (peace pact) system of the Kalinga is governance through personal relationship — elders negotiate truces through kinship, ritual, and mutual obligation. No courts, no written law. It's the most sophisticated example of Filipino family-over-institution trust still operating today." },
    { from: "r23", to: "b18", insight: "Spain and America both labeled Igorots as 'uncivilized' to justify their exclusion. Christianized lowlanders internalized this — Igorots, Lumad, and Moros became 'other' in the Filipino imagination. This vertical divide between highland and lowland peoples is colonial engineering." },
    // Kapampangan connections
    { from: "r24", to: "b18", insight: "When Spain used Kapampangan soldiers against the Silang Revolt and Moro raids, it created lasting inter-ethnic resentment. Ilocanos remember Kapampangan troops crushing their revolts. Moros remember Kapampangan raiders. Colonial collaboration had consequences that outlived the colony." },
    { from: "r24", to: "b21", insight: "Kapampangans developed a distinct identity as both colonized and collaborator — warriors who served the Spanish but also maintained fierce cultural pride in their cuisine, language, and traditions. The tension between 'we survived by serving' and 'we served and it cost our reputation' is unique to Pampanga." },
    { from: "r24", to: "b7", insight: "Kapampangan elites gained land and privileges through Spanish service — creating a patronage template. When you get ahead by serving power, you build systems that reward loyalty over merit. This model spread beyond Pampanga into Philippine political culture broadly." },
    // Negros Sugar Economy connections
    { from: "r25", to: "b22", insight: "Negros Occidental is the clearest example: a handful of haciendero families controlled sugar production, labor, land, and politics for over a century. Bacolod's wealth and poverty exist side by side because the economy was designed to concentrate wealth, not distribute it." },
    { from: "r25", to: "b11", insight: "In the sugar hacienda economy, sacadas (migrant laborers) competed for seasonal work controlled by a single family. Resources were genuinely zero-sum. Crab mentality in sugar provinces isn't cultural pathology — it's the rational behavior of people in an economy designed to keep them competing for scraps." },
    { from: "r25", to: "b20", insight: "Bacolod's MassKara Festival was created in 1980 after a sugar crisis and a maritime tragedy devastated the city. The response was: put on masks, dance, celebrate anyway. Visayan fiesta culture as defiance — smiling through catastrophe isn't denial, it's resistance." },
    // Moro Wars / Slave Raids connections
    { from: "r26", to: "b19", insight: "Centuries of Moro slave raids on Visayan coastal towns — and Spanish-led retaliatory expeditions using Christianized Filipino soldiers — created a cycle of violence that encoded Christian-Muslim hostility into the DNA of both communities. The fear and hatred aren't ancient; they're specifically colonial." },
    { from: "r26", to: "b18", insight: "Spain weaponized the Moro raids: 'See, you need us to protect you from the Muslims.' Christianized Filipinos were recruited to fight Moros, deepening the divide. The same tactic: use one group's fear of another to maintain control over both." },
    { from: "r26", to: "b5", insight: "Visayan coastal communities built watchtowers (bantayan — hence Bantayan Island) and organized family-based defense networks against Moro raids. When the state can't protect you, you protect your own. Family-over-institution trust in the Visayas was literally forged under siege." },
    // Cavite-Batangas Revolutionary Heartland connections
    { from: "r27", to: "b21", insight: "Southern Tagalog provinces developed a revolutionary identity that other regions didn't share. Caviteños claim the Katipunan, Batangueños claim the last resistance against America. This created a 'we started the nation' pride that feeds into Tagalog/Manila centrism." },
    { from: "r27", to: "b23", insight: "The Philippine revolution was led from Cavite and Manila. Independence was declared in Kawit, Cavite. The republic was seated in Malolos, Bulacan. Tagalog became the national language. When Visayans, Moros, and Ilocanos complain about Manila centrism, this is the origin: the nation was built from one region's revolution." },
    { from: "r27", to: "b13", insight: "Batangas suffered some of the worst atrocities of the Philippine-American War — General Bell's concentration camps killed thousands. When the province that fought hardest for independence was punished most brutally, the lesson was: institutions reward compliance, not courage." },
    // Mindanao Settler Colonialism connections
    { from: "r28", to: "b19", insight: "When the Philippine government resettled millions of Christian Filipinos into Mindanao, Moros were displaced from ancestral land on their own island. The Christian-Muslim divide isn't just historical — it's about land taken within living memory. BARMM exists because the wound is still open." },
    { from: "r28", to: "b24", insight: "Mindanao settler colonialism was the Philippine state doing to Moros and Lumad what Spain and America did to everyone: taking land and calling it 'development.' The modern Lumad and Moro land defense movement is resistance to Filipino internal colonialism, not just foreign imperialism." },
    { from: "r28", to: "b22", insight: "Multinational companies followed the settlers into Mindanao — plantations for pineapple (Dole), banana (Del Monte), rubber, and palm oil. Mindanao became the Philippines' 'resource colony,' its wealth extracted to Manila while local communities remained the poorest in the nation." },
    // Typhoon Belt connections
    { from: "r29", to: "b9", insight: "When your house gets destroyed by typhoons every few years, you learn to rebuild fast with whatever's available. Waray diskarte isn't metaphorical — it's the skill of reconstructing a life from debris, annually. Resilience in Eastern Visayas is a survival technology." },
    { from: "r29", to: "b20", insight: "The Waray reputation for toughness and dark humor comes from living in the typhoon belt. You joke about the storm because crying doesn't rebuild the roof. Visayan humor-through-hardship reaches its most extreme form in the people who face the most extreme weather." },
    { from: "r29", to: "b3", insight: "When a super typhoon can erase everything you've built in a single night, planning feels futile. 'Bahala na' in Eastern Visayas isn't laziness — it's the only rational philosophy when you live in a place where nature can reset your life to zero without warning." },
    // Marcos Cordillera Dam Resistance connections
    { from: "r30", to: "b24", insight: "When Macli-ing Dulag was assassinated for opposing the Chico Dam, he became a martyr that united previously rival Cordillera tribes. His death proved that defending ancestral land could cost your life — and that the Philippine state would kill its own citizens to build infrastructure." },
    { from: "r30", to: "b21", insight: "Before the dam resistance, 'Igorot' was a loose term for unrelated mountain peoples. The shared fight against Marcos forged a collective Cordillera identity that didn't exist before. Sometimes oppression creates the unity it fears." },
    { from: "r30", to: "b13", insight: "The Marcos government planned to submerge entire Bontoc and Kalinga communities for a dam. When your own government designates your homeland as disposable infrastructure, institutional distrust isn't paranoia — it's pattern recognition." },
    // Bangsamoro connections
    { from: "r31", to: "b19", insight: "The Jabidah Massacre of 1968 — where Filipino Muslim military recruits were killed by their own government — became the catalyst for armed Moro separatism. The Christian-Muslim divide deepened not through cultural difference but through state violence against Muslim citizens." },
    { from: "r31", to: "b24", insight: "BARMM represents the only case in Philippine history where armed resistance led to formal territorial autonomy. For Moro communities, this proves that only sustained pressure — not faith in institutions — produces self-determination." },
    { from: "r31", to: "b23", insight: "The Moro conflict is the clearest case of Manila centrism's consequences: a Manila-based government made decisions about Mindanao land, resources, and demographics without Moro consent for decades. BARMM is an attempt to correct this — but the asymmetry persists in how 'Philippine history' is told." },
    // Pre-colonial Chinese trade connections
    { from: "r32", to: "b25", insight: "The suki system — loyalty between buyer and seller, built on repeated personal transactions — mirrors Chinese merchant culture where trust-based trade networks mattered more than price competition. Before Spain arrived, Filipino-Chinese commerce already ran on relationships, not contracts." },
    { from: "r32", to: "b27", insight: "Chinese trade goods became so embedded in Filipino life that their origin was forgotten. Porcelain became part of burial practices, silk became a prestige marker, and Chinese-style boats influenced Filipino shipbuilding. The cultural absorption happened over centuries of voluntary exchange — not colonial imposition." },
    { from: "r32", to: "b5", insight: "Pre-colonial Filipino-Chinese trade was conducted through personal relationships between datu traders and Hokkien merchants. No courts, no institutions — just trust between families who traded across generations. This reinforced the Filipino pattern: commerce works through personal bonds, not systems." },
    // Sangley Merchants connections
    { from: "r33", to: "b26", insight: "Spain needed Chinese labor and commerce to survive, but feared Chinese wealth and numbers. The cycle of exploitation-then-massacre (1603: ~23,000 killed; 1639; 1662; 1686) taught a brutal lesson: being economically essential doesn't protect you from violence. Chinese-Filipino wariness of political visibility traces to literal pogroms." },
    { from: "r33", to: "b8", insight: "The Parian was a ghetto — but it was also a self-contained economy. Confined to one district, Sangley merchants built dense networks of mutual aid, clan-based lending, and apprentice systems. When the state excludes you, you build your own infrastructure. Filipino-Chinese business networks still run on this model." },
    { from: "r33", to: "b18", insight: "Spain used anti-Chinese sentiment to unite Christianized Filipinos against a common 'other.' Indios and mestizos were recruited for anti-Chinese violence. This manufactured division between ethnic Filipinos and ethnic Chinese persists in political rhetoric whenever someone wants to deflect from structural inequality." },
    // Chinese Mestizo / Ilustrado connections
    { from: "r34", to: "b22", insight: "Chinese mestizo families accumulated capital through trade, then converted it to land, then to political power. The Cojuangcos, Ayalas, and other oligarch families trace lineages through this exact pathway: Chinese commercial wealth → hacienda ownership → political dynasty. The oligarchy has Sangley roots." },
    { from: "r34", to: "b4", insight: "Chinese mestizos occupied an ambiguous position: higher-status than indios but lower than peninsulares. Many downplayed their Chinese heritage to claim Spanish or 'pure Filipino' identity. Rizal himself asked to be reclassified as indio despite his Chinese ancestry. Colonial mentality created incentives to erase Chinese roots." },
    { from: "r34", to: "b12", insight: "In the colonial caste system, mestizo de sangley ranked above indio. Chinese-Filipino features — lighter skin, certain facial features — became associated with wealth and status. The skin hierarchy in the Philippines isn't just about Spanish blood; Chinese mestizo heritage is woven into the preference for lighter complexions." },
    // Sari-sari store connections
    { from: "r35", to: "b28", insight: "Chinese retailers pioneered the tingi model: breaking bulk goods into small, affordable portions for daily purchase. A Filipino who buys one sachet of shampoo or three cigarettes is participating in a retail innovation that Chinese merchants developed centuries ago to serve cash-poor customers." },
    { from: "r35", to: "b8", insight: "The sari-sari store is the Philippines' most iconic micro-enterprise — and it's a Chinese commercial model that Filipinos inherited. Chinese-owned stores were larger and more profitable; when the Nationalization Act forced Chinese out, Filipinos adopted the format but at smaller scale. The 'Filipino' sari-sari is a Chinese retail technology, democratized." },
    { from: "r35", to: "b25", insight: "Chinese sari-sari owners built the suki system into neighborhood retail: know your customers, extend credit, build loyalty. When Filipino nanays took over these stores, they kept the relational model. The suki bond between store owner and neighbor is Chinese merchant practice filtered through Filipino community values." },
    // Tsinoy economic dominance connections
    { from: "r36", to: "b26", insight: "When 1.5% of the population controls a majority of corporate wealth, the math creates resentment regardless of how that wealth was built. But the Tsinoy dominance story starts with Sangley survival: families who endured massacres, ghettos, and nationalization laws built resilience into their business DNA. Privilege and persecution coexist." },
    { from: "r36", to: "b22", insight: "SM, BDO, Metrobank, Jollibee, Universal Robina — the Philippines' largest companies are Tsinoy-founded. This concentration didn't happen by accident: it's the end result of 400 years of Chinese commercial networks compounding through Spanish mestizo privilege, American-era industrialization, and post-independence capital accumulation." },
    { from: "r36", to: "b13", insight: "For many Filipinos, 'the system' means an economy where Chinese-Filipino conglomerates own the malls, banks, and food companies while ethnic Filipinos work in them. Institutional distrust isn't just about government — it's about an economic structure that feels rigged by birth, not merit." },
    // Chinese cultural absorption connections
    { from: "r37", to: "b27", insight: "Pancit, siopao, lumpia, toyo (soy sauce), taho, hopia — these aren't 'Chinese food in the Philippines.' They're Filipino food with Chinese origins so old the origin was forgotten. When every birthday has pancit for long life and every New Year has tikoy and round fruits, Chinese culture has become Filipino culture." },
    { from: "r37", to: "b10", insight: "Filipino folk Catholicism absorbed Chinese folk beliefs without naming them: feng shui for house placement, lucky numbers for weddings, the importance of the Chinese New Year 'prosperity basket.' The syncretic Filipino religious instinct — blending everything into one practice — absorbed Chinese superstition alongside Catholic ritual and animist spirits." },
    { from: "r37", to: "b25", insight: "The word 'kuya' (older brother) is from Hokkien. 'Ate' (older sister) may also have Chinese roots. Even the kinship language Filipinos use daily carries Chinese DNA. When a sari-sari store owner calls her regular customer 'suki,' she's using a relationship framework built from Chinese, Malay, and indigenous Filipino commercial culture fused over centuries." },
  ],
};

const PERIOD_MAP = {};
DATA.periods.forEach(p => { PERIOD_MAP[p.id] = p; });

const ROOT_MAP = {};
DATA.roots.forEach(r => { ROOT_MAP[r.id] = r; });

const BEHAVIOR_MAP = {};
DATA.behaviors.forEach(b => { BEHAVIOR_MAP[b.id] = b; });

export default function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [activePeriods, setActivePeriods] = useState(new Set(DATA.periods.map(p => p.id)));
  const [hoveredConn, setHoveredConn] = useState(null);
  const [viewMode, setViewMode] = useState("network"); // "network" | "detail"

  const togglePeriod = (pid) => {
    setActivePeriods(prev => {
      const next = new Set(prev);
      if (next.has(pid)) next.delete(pid); else next.add(pid);
      return next;
    });
  };

  const activeRoots = useMemo(() =>
    DATA.roots.filter(r => activePeriods.has(r.period)),
    [activePeriods]
  );

  const activeConnections = useMemo(() => {
    const rootIds = new Set(activeRoots.map(r => r.id));
    return DATA.connections.filter(c => rootIds.has(c.from));
  }, [activeRoots]);

  const connectedBehaviors = useMemo(() => {
    const bIds = new Set(activeConnections.map(c => c.to));
    return DATA.behaviors.filter(b => bIds.has(b.id));
  }, [activeConnections]);

  const highlightedConns = useMemo(() => {
    if (!selectedNode) return new Set();
    return new Set(
      activeConnections
        .filter(c => c.from === selectedNode || c.to === selectedNode)
        .map(c => `${c.from}-${c.to}`)
    );
  }, [selectedNode, activeConnections]);

  const connectedToSelected = useMemo(() => {
    if (!selectedNode) return new Set();
    const ids = new Set();
    activeConnections.forEach(c => {
      if (c.from === selectedNode) ids.add(c.to);
      if (c.to === selectedNode) ids.add(c.from);
    });
    return ids;
  }, [selectedNode, activeConnections]);

  const selectedConns = useMemo(() => {
    if (!selectedNode) return [];
    return activeConnections.filter(c => c.from === selectedNode || c.to === selectedNode);
  }, [selectedNode, activeConnections]);

  const selectNode = (id, type) => {
    if (selectedNode === id) {
      setSelectedNode(null);
      setSelectedType(null);
    } else {
      setSelectedNode(id);
      setSelectedType(type);
    }
  };

  const getNodeOpacity = (id) => {
    if (!selectedNode) return 1;
    if (id === selectedNode) return 1;
    if (connectedToSelected.has(id)) return 1;
    return 0.15;
  };

  const selectedData = selectedNode
    ? (selectedType === "root" ? ROOT_MAP[selectedNode] : BEHAVIOR_MAP[selectedNode])
    : null;

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3a3530; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Ugat</h1>
          <p style={styles.subtitle}>Tracing Filipino behavior to its historical roots</p>
        </div>
        <div style={styles.legend}>
          <span style={styles.legendLabel}>FILTER BY ERA</span>
          <div style={styles.periodFilters}>
            {DATA.periods.map(p => (
              <button
                key={p.id}
                onClick={() => togglePeriod(p.id)}
                style={{
                  ...styles.periodBtn,
                  borderColor: p.color,
                  background: activePeriods.has(p.id) ? p.color : "transparent",
                  color: activePeriods.has(p.id) ? "#fff" : p.color,
                  opacity: activePeriods.has(p.id) ? 1 : 0.5,
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Left Column: Historical Roots */}
        <div style={styles.column}>
          <div style={styles.colHeader}>
            <span style={styles.colIcon}>◀</span>
            <span style={styles.colTitle}>HISTORICAL ROOTS</span>
            <span style={styles.colCount}>{activeRoots.length}</span>
          </div>
          <div style={styles.cardList}>
            {DATA.periods.filter(p => activePeriods.has(p.id)).map(period => {
              const periodRoots = activeRoots.filter(r => r.period === period.id);
              if (!periodRoots.length) return null;
              return (
                <div key={period.id}>
                  <div style={{ ...styles.periodTag, color: period.color, borderColor: period.color }}>
                    {period.label} · {period.years}
                  </div>
                  {periodRoots.map(root => {
                    const isSelected = selectedNode === root.id;
                    const opacity = getNodeOpacity(root.id);
                    const connCount = activeConnections.filter(c => c.from === root.id).length;
                    return (
                      <div
                        key={root.id}
                        onClick={() => selectNode(root.id, "root")}
                        style={{
                          ...styles.card,
                          opacity,
                          borderLeft: `3px solid ${period.color}`,
                          background: isSelected ? "#2a2520" : connectedToSelected.has(root.id) ? "#252220" : "#1a1815",
                          cursor: "pointer",
                          transform: isSelected ? "scale(1.01)" : "scale(1)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div style={styles.cardTitle}>{root.title}</div>
                        {(isSelected || !selectedNode) && (
                          <div style={styles.cardDesc}>{root.desc}</div>
                        )}
                        <div style={styles.connBadge}>
                          {connCount} connection{connCount !== 1 ? "s" : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Connections / Insights */}
        <div style={styles.center}>
          {!selectedNode ? (
            <div style={styles.centerEmpty}>
              <div style={styles.centerIcon}>⟷</div>
              <p style={styles.centerHint}>Select any card to reveal<br/>the connections between<br/>past and present</p>
              <div style={styles.statsGrid}>
                <div style={styles.stat}>
                  <div style={styles.statNum}>{DATA.roots.length}</div>
                  <div style={styles.statLabel}>Historical Forces</div>
                </div>
                <div style={styles.stat}>
                  <div style={styles.statNum}>{DATA.behaviors.length}</div>
                  <div style={styles.statLabel}>Modern Behaviors</div>
                </div>
                <div style={styles.stat}>
                  <div style={styles.statNum}>{DATA.connections.length}</div>
                  <div style={styles.statLabel}>Connections</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.insightPanel}>
              <div style={styles.insightHeader}>
                <span style={styles.insightIcon}>◈</span>
                <span>INSIGHTS</span>
              </div>
              <div style={styles.insightFrom}>
                {selectedType === "root"
                  ? `From: ${selectedData?.title}`
                  : `To: ${selectedData?.title}`
                }
              </div>
              <div style={styles.insightList}>
                {selectedConns.map((conn, i) => {
                  const otherNode = selectedType === "root"
                    ? BEHAVIOR_MAP[conn.to]
                    : ROOT_MAP[conn.from];
                  const period = selectedType === "root"
                    ? PERIOD_MAP[ROOT_MAP[conn.from]?.period]
                    : PERIOD_MAP[ROOT_MAP[conn.from]?.period];
                  const isHovered = hoveredConn === i;
                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredConn(i)}
                      onMouseLeave={() => setHoveredConn(null)}
                      style={{
                        ...styles.insightCard,
                        borderLeft: `2px solid ${period?.color || "#555"}`,
                        background: isHovered ? "#2a2520" : "#1e1b18",
                      }}
                    >
                      <div style={styles.insightConnLabel}>
                        {selectedType === "root" ? "→" : "←"} {otherNode?.title}
                      </div>
                      <div style={styles.insightText}>{conn.insight}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Modern Behaviors */}
        <div style={styles.column}>
          <div style={styles.colHeader}>
            <span style={styles.colTitle}>MODERN BEHAVIORS</span>
            <span style={styles.colIcon}>▶</span>
            <span style={styles.colCount}>{connectedBehaviors.length}</span>
          </div>
          <div style={styles.cardList}>
            {connectedBehaviors.map(beh => {
              const isSelected = selectedNode === beh.id;
              const opacity = getNodeOpacity(beh.id);
              const connCount = activeConnections.filter(c => c.to === beh.id).length;
              const rootPeriods = activeConnections
                .filter(c => c.to === beh.id)
                .map(c => PERIOD_MAP[ROOT_MAP[c.from]?.period])
                .filter(Boolean);
              const uniquePeriods = [...new Map(rootPeriods.map(p => [p.id, p])).values()];

              return (
                <div
                  key={beh.id}
                  onClick={() => selectNode(beh.id, "behavior")}
                  style={{
                    ...styles.card,
                    opacity,
                    borderRight: `3px solid #8B7D5E`,
                    borderLeft: "none",
                    background: isSelected ? "#2a2520" : connectedToSelected.has(beh.id) ? "#252220" : "#1a1815",
                    cursor: "pointer",
                    transform: isSelected ? "scale(1.01)" : "scale(1)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={styles.cardTitle}>{beh.title}</div>
                  {(isSelected || !selectedNode) && (
                    <div style={styles.cardDesc}>{beh.desc}</div>
                  )}
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
                    {uniquePeriods.map(p => (
                      <span key={p.id} style={{ ...styles.dotBadge, background: p.color }} title={p.label} />
                    ))}
                    <span style={styles.connBadge}>
                      {connCount} root{connCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span style={{ opacity: 0.4 }}>Ugat — "root" in Filipino</span>
        <span style={{ opacity: 0.3 }}>Click any card to explore · Filter eras above</span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#141210",
    color: "#d4c8b8",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "20px 24px 12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 12,
    borderBottom: "1px solid #2a2520",
  },
  title: {
    fontFamily: "'Crimson Pro', serif",
    fontSize: 40,
    fontWeight: 300,
    letterSpacing: "0.08em",
    color: "#e8d5b7",
    margin: 0,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 300,
    color: "#8B7D5E",
    letterSpacing: "0.04em",
    marginTop: 2,
  },
  legend: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 6,
  },
  legendLabel: {
    fontSize: 11,
    letterSpacing: "0.12em",
    color: "#5a5245",
    fontWeight: 600,
  },
  periodFilters: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  periodBtn: {
    padding: "4px 10px",
    fontSize: 13,
    fontWeight: 500,
    border: "1px solid",
    borderRadius: 3,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  },
  main: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
    minHeight: 0,
  },
  column: {
    flex: "1 1 30%",
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    borderRight: "1px solid #1e1b18",
  },
  colHeader: {
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    borderBottom: "1px solid #1e1b18",
  },
  colIcon: {
    fontSize: 12,
    color: "#5a5245",
  },
  colTitle: {
    fontSize: 12,
    letterSpacing: "0.12em",
    color: "#8B7D5E",
    fontWeight: 600,
    flex: 1,
  },
  colCount: {
    fontSize: 12,
    color: "#5a5245",
    fontWeight: 600,
    background: "#1e1b18",
    padding: "2px 6px",
    borderRadius: 3,
  },
  cardList: {
    flex: 1,
    overflowY: "auto",
    padding: "8px 10px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  periodTag: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.1em",
    padding: "8px 0 4px",
    borderBottom: "1px solid",
    marginBottom: 4,
    textTransform: "uppercase",
    opacity: 0.8,
  },
  card: {
    padding: "10px 12px",
    borderRadius: 4,
    borderLeft: "3px solid #555",
    transition: "all 0.2s ease",
  },
  cardTitle: {
    fontFamily: "'Crimson Pro', serif",
    fontSize: 17,
    fontWeight: 500,
    color: "#e8d5b7",
    marginBottom: 4,
    lineHeight: 1.3,
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 1.55,
    color: "#9a8e7e",
    marginBottom: 6,
  },
  connBadge: {
    fontSize: 11,
    color: "#5a5245",
    fontWeight: 500,
    letterSpacing: "0.05em",
  },
  dotBadge: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    display: "inline-block",
  },
  center: {
    flex: "1 1 28%",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #1e1b18",
    minWidth: 0,
  },
  centerEmpty: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    textAlign: "center",
    gap: 16,
  },
  centerIcon: {
    fontSize: 44,
    color: "#3a3530",
    fontWeight: 300,
  },
  centerHint: {
    fontSize: 16,
    color: "#5a5245",
    lineHeight: 1.6,
    fontWeight: 300,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 12,
    marginTop: 16,
    width: "100%",
  },
  stat: {
    textAlign: "center",
    padding: "12px 4px",
    background: "#1a1815",
    borderRadius: 4,
  },
  statNum: {
    fontFamily: "'Crimson Pro', serif",
    fontSize: 30,
    fontWeight: 300,
    color: "#e8d5b7",
  },
  statLabel: {
    fontSize: 10,
    letterSpacing: "0.1em",
    color: "#5a5245",
    fontWeight: 600,
    marginTop: 2,
    textTransform: "uppercase",
  },
  insightPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  insightHeader: {
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    letterSpacing: "0.12em",
    color: "#8B7D5E",
    fontWeight: 600,
    borderBottom: "1px solid #1e1b18",
  },
  insightIcon: {
    fontSize: 17,
    color: "#C4A35A",
  },
  insightFrom: {
    padding: "10px 16px",
    fontSize: 15,
    color: "#e8d5b7",
    fontFamily: "'Crimson Pro', serif",
    fontWeight: 500,
    background: "#1a1815",
    borderBottom: "1px solid #1e1b18",
  },
  insightList: {
    flex: 1,
    overflowY: "auto",
    padding: 10,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  insightCard: {
    padding: "10px 12px",
    borderRadius: 4,
    transition: "all 0.15s ease",
  },
  insightConnLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: "#C4A35A",
    marginBottom: 6,
    fontFamily: "'Crimson Pro', serif",
  },
  insightText: {
    fontSize: 15,
    lineHeight: 1.65,
    color: "#b8a998",
    fontWeight: 300,
  },
  footer: {
    padding: "8px 24px",
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    color: "#5a5245",
    borderTop: "1px solid #1e1b18",
  },
};
