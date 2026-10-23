(async()=>{const VERSES=await (await fetch('/verses.json')).json();
const MOBILE=/Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent)||(!!window.matchMedia&&matchMedia('(pointer:coarse)').matches);
const TX={
hi:{
 'Every Arjuna needs a charioteer':'हर अर्जुन को एक सारथी चाहिए',
 'Speak what weighs on your heart. He listens, asks, then shows the right path from the Bhagavad Gītā.':'अपने मन का बोझ कहिए। वे सुनते हैं, पूछते हैं, फिर भगवद्गीता से सही मार्ग दिखाते हैं।',
 'Tap the mic and speak to Krishna, or write here…':'माइक दबाकर कृष्ण से बोलिए, या यहाँ लिखिए…',
 'Ask Krishna':'कृष्ण से पूछें',
 'Not sure how to begin? Try one of these':'कैसे शुरू करें, समझ नहीं आ रहा? इनमें से कोई आज़माइए',
 '↺ New conversation':'↺ नई बातचीत',
 'Speak':'बोलिए','Be understood':'समझे जाइए','Receive the verse':'श्लोक पाइए','Walk the path':'मार्ग पर चलिए',
 'History':'इतिहास','Library':'श्लोक संग्रह','Saved':'सहेजे गए',
 'The Gītā, verse by verse':'गीता, श्लोक दर श्लोक',
 'Eighteen chapters, 701 verses, each with its Sanskrit, transliteration and word-by-word meaning. Search by word, theme or number, like 2.47.':'अठारह अध्याय, 701 श्लोक: हर एक में संस्कृत पाठ, लिप्यंतरण और शब्दार्थ। शब्द, विषय या संख्या (जैसे 2.47) से खोजिए।',
 'Search: fear, 2.47, detachment, ‘fruit of action’…':'खोजें: भय, 2.47, वैराग्य, ‘कर्म का फल’…',
 'Verses you kept':'आपके सहेजे श्लोक',
 'Saved only in this browser.':'केवल इसी ब्राउज़र में सहेजे गए।',
 'Tap ♡ on any verse to keep it here.':'किसी भी श्लोक पर ♡ दबाइए, वह यहाँ सहेजा जाएगा।',
 'How Krishna guides you here':'यहाँ कृष्ण आपका मार्गदर्शन कैसे करते हैं',
 'The same way he guided Arjuna on the field of Kurukshetra: first he listened.':'जैसे उन्होंने कुरुक्षेत्र की रणभूमि में अर्जुन का मार्गदर्शन किया था: पहले उन्होंने सुना।',
 'He listens first':'वे पहले सुनते हैं',
 'Speak or type. If your words are brief, Krishna reflects what he heard and asks one gentle question before he teaches.':'बोलिए या लिखिए। यदि आपके शब्द कम हों, तो कृष्ण जो सुना उसे दोहराते हैं और सिखाने से पहले एक कोमल प्रश्न पूछते हैं।',
 'One verse, chosen for you':'आपके लिए चुना गया एक श्लोक',
 'Your words are matched against all 701 verses. The Sanskrit and transliteration come from the Gītā itself. The English, Hindi and Telugu meanings are translations; the Hindi and Telugu were prepared with AI and reviewed against the Sanskrit.':'आपके शब्दों का मिलान सभी 701 श्लोकों से किया जाता है। संस्कृत पाठ और लिप्यंतरण गीता से ही हैं। अंग्रेज़ी, हिंदी और तेलुगु अर्थ अनुवाद हैं; हिंदी और तेलुगु अनुवाद AI की सहायता से तैयार किए गए और संस्कृत से मिलान कर जाँचे गए हैं।',
 'Three languages':'तीन भाषाएँ',
 'English, हिंदी and తెలుగు. The shlokas are in Sanskrit, shown in Devanagari, or in Telugu script when Telugu is chosen.':'अंग्रेज़ी, हिंदी और तेलुगु। श्लोक संस्कृत में हैं, देवनागरी में दिखाए जाते हैं।',
 'Keep and share':'सहेजिए और साझा कीजिए',
 'Turn any verse into a 1080×1080 shloka card, save it, and return to it. Your saved verses stay on your device.':'किसी भी श्लोक को 1080×1080 श्लोक-कार्ड बनाइए, सहेजिए और फिर लौटिए। आपके सहेजे श्लोक आपके डिवाइस पर ही रहते हैं।',
 'Questions, answered':'प्रश्न और उत्तर',
 'What people ask before they begin.':'शुरू करने से पहले लोग क्या पूछते हैं।',
 'All eighteen chapters':'सभी अठारह अध्याय',
 'Read every verse with its meaning.':'हर श्लोक अर्थ सहित पढ़िए।',
 'About the maker':'निर्माता के बारे में',
 'Hi, I’m Madhan. I build Gitopadesh as a quiet place to bring a hard question and hear the Gītā answer it. See my other projects and say hello on my portfolio.':'नमस्ते, मैं Madhan हूँ। मैंने गीतोपदेश को एक शांत स्थान के रूप में बनाया है, जहाँ आप कोई कठिन प्रश्न ला सकें और गीता से उसका उत्तर सुन सकें। मेरे अन्य प्रोजेक्ट देखिए और मेरे पोर्टफ़ोलियो पर नमस्ते कहिए।',
 'Gitopadesh offers reflections drawn from the Bhagavad Gītā. It is not medical, legal or mental-health advice. If you are in crisis, contact a local helpline or someone you trust now.':'गीतोपदेश भगवद्गीता से ली गई अनुभूतियाँ प्रस्तुत करता है। यह चिकित्सा, कानूनी या मानसिक स्वास्थ्य सलाह नहीं है। यदि आप संकट में हैं, तो अभी किसी स्थानीय हेल्पलाइन या अपने किसी विश्वसनीय व्यक्ति से संपर्क कीजिए।',
 'Your words are sent to Amazon Bedrock to write Krishna’s reply, and each sentence he speaks is sent to Microsoft’s speech service. Gitopadesh does not store them; your conversation history stays only in your browser.':'आपके शब्द कृष्ण का उत्तर लिखने के लिए Amazon Bedrock को भेजे जाते हैं, और उनके बोले हर वाक्य को बोलने के लिए Microsoft की वाक् सेवा को भेजा जाता है। गीतोपदेश इन्हें संग्रहीत नहीं करता; आपकी बातचीत का इतिहास केवल आपके ब्राउज़र में रहता है।',
 'Gitopadesh needs JavaScript for the voice conversation. You can still read every verse from the chapter links above.':'वाणी-संवाद के लिए गीतोपदेश को JavaScript चाहिए। ऊपर के अध्याय-लिंक से आप हर श्लोक पढ़ सकते हैं।',
 'Read the full teaching ↓':'पूरा उपदेश पढ़िए ↓',
 'All':'सभी','Show more':'और दिखाइए','Nothing here yet.':'यहाँ अभी कुछ नहीं है।',
 'You':'आप','Chapter':'अध्याय','Verse':'श्लोक','Bhagavad Gītā':'भगवद्गीता','Word by word':'शब्दार्थ','Pronunciation':'उच्चारण',
 'Shloka card':'श्लोक कार्ड','Midnight':'मध्यरात्रि','Saffron':'केसरिया','Lotus':'कमल',
 '⬇ Download 1080×1080':'⬇ 1080×1080 डाउनलोड करें','♡ Save':'♡ सहेजें','♥ Saved':'♥ सहेजा गया','⧉ Copy verse':'⧉ श्लोक कॉपी करें','Next verse ➜':'अगला श्लोक ➜',
 '🕉 Recite shloka':'🕉 श्लोक पाठ सुनें','📖 Teach me this shloka':'📖 यह श्लोक समझाइए','🖼 Shloka card':'🖼 श्लोक कार्ड','⧉ Copy':'⧉ कॉपी','♡ Save verse':'♡ श्लोक सहेजें','🔊 Listen':'🔊 सुनें',
 '🔊 Listen to the lesson':'🔊 पाठ सुनें','Delete':'हटाएँ',
 'Verse of the moment':'इस क्षण का श्लोक','🪷 Another verse':'🪷 दूसरा श्लोक','Open shloka card':'श्लोक कार्ड खोलें',
 'Your conversations':'आपकी बातचीत','Kept only in this browser. Nothing is stored on a server.':'केवल इसी ब्राउज़र में रखी गई है। सर्वर पर कुछ संग्रहीत नहीं होता।',
 'No conversations yet. Speak to Krishna and they will appear here.':'अभी कोई बातचीत नहीं है। कृष्ण से बोलिए, वे यहाँ दिखेंगी।',
 'Clear all history':'पूरा इतिहास मिटाएँ','Tap again to confirm':'पुष्टि के लिए फिर दबाइए','← All conversations':'← सभी बातचीत',
 'Krishna asked':'कृष्ण ने पूछा','Teaching':'उपदेश','Dialogue':'संवाद',
 'Copied':'कॉपी हो गया','Saved ♥':'सहेजा गया ♥','Removed':'हटा दिया गया','History cleared':'इतिहास मिटा दिया गया','A new conversation begins':'नई बातचीत शुरू हुई',
 'Speak or type what is on your heart 🙏':'अपने मन की बात बोलिए या लिखिए 🙏',
 'Krishna rests a moment. Please try again in a minute.':'कृष्ण क्षण भर विश्राम कर रहे हैं। कृपया एक मिनट बाद फिर प्रयास कीजिए।',
 'Many seekers are here today. Showing the offline guide.':'आज बहुत साधक आए हैं। ऑफ़लाइन मार्गदर्शन दिखाया जा रहा है।',
 'Krishna’s cloud voice is unreachable. Showing the offline guide.':'कृष्ण की क्लाउड वाणी अभी उपलब्ध नहीं है। ऑफ़लाइन मार्गदर्शन दिखाया जा रहा है।',
 'Reciting the shloka… ॐ':'श्लोक का पाठ हो रहा है… ॐ','The lesson is still being prepared':'पाठ अभी तैयार हो रहा है',
 'The full lesson is unavailable right now. Showing the meaning.':'पूरा पाठ अभी उपलब्ध नहीं है। अर्थ दिखाया जा रहा है।',
 'Sending to Krishna… tap the box to edit':'कृष्ण को भेजा जा रहा है… बदलने के लिए बॉक्स दबाइए',
 'Voice input needs Chrome, Edge or Safari. You can still type.':'वाणी इनपुट के लिए Chrome, Edge या Safari चाहिए। आप लिख सकते हैं।',
 'Hands-free paused. Tap the mic when ready.':'हैंड्स-फ़्री रुका है। तैयार होने पर माइक दबाइए।',
 'Listening… speak freely. I wait while you pause.':'सुन रहा हूँ… निःसंकोच बोलिए। आप रुकेंगे तो मैं प्रतीक्षा करूँगा।',
 'Krishna is listening to what you said…':'कृष्ण आपकी बात सुन रहे हैं…',
 'I could not hear that clearly. Please try again or type.':'मैं स्पष्ट सुन नहीं पाया। कृपया फिर कहिए या लिखिए।',
 'Hands-free on: Krishna will listen again after he speaks':'हैंड्स-फ़्री चालू: बोलने के बाद कृष्ण फिर सुनेंगे','Hands-free off':'हैंड्स-फ़्री बंद',
 'Allow the microphone so Krishna can hear you.':'माइक्रोफ़ोन की अनुमति दीजिए ताकि कृष्ण आपको सुन सकें।',
 'I heard nothing. Tap the mic and speak again.':'कुछ सुनाई नहीं दिया। माइक दबाकर फिर बोलिए।',
 'The speech service is unreachable. Please type instead.':'वाक् सेवा उपलब्ध नहीं है। कृपया लिखिए।','No microphone was found.':'कोई माइक्रोफ़ोन नहीं मिला।',
 'Krishna will answer in हिंदी':'कृष्ण हिंदी में उत्तर देंगे','Krishna will answer in తెలుగు':'कृष्ण तेलुगु में उत्तर देंगे',
 'Close':'बंद करें','Home':'मुख्य पृष्ठ',
 'Card copied. Paste it into the WhatsApp chat.':'कार्ड कॉपी हो गया। इसे WhatsApp चैट में पेस्ट कीजिए।','Card saved. Attach it in WhatsApp.':'कार्ड सहेज लिया गया। इसे WhatsApp में जोड़िए।',
 '📲 Share':'📲 साझा करें','Copy link':'लिंक कॉपी करें','Link copied':'लिंक कॉपी हो गया',
 'Listening… take your time. I keep listening through your pauses. Tap the mic when you are done, then press Ask Krishna.':'सुन रहा हूँ… आराम से बोलिए। आपके रुकने पर भी मैं सुनता रहूँगा। बात पूरी होने पर माइक दबाइए, फिर “कृष्ण से पूछें” दबाइए।','Tap the mic when you want to continue.':'आगे बोलना हो तो माइक दबाइए।',
 'Krishna is taking longer than usual. Showing the quick guide.':'कृष्ण को सामान्य से अधिक समय लग रहा है। त्वरित मार्गदर्शन दिखाया जा रहा है।','The lesson is taking longer than usual. Showing the meaning.':'पाठ में सामान्य से अधिक समय लग रहा है। अर्थ दिखाया जा रहा है।','Something went wrong. Please try again.':'कुछ गड़बड़ हो गई। कृपया फिर प्रयास कीजिए।',
 'visitors':'आगंतुक','online now':'अभी ऑनलाइन','Counted with an anonymous random ID: no account or personal details.':'एक गुमनाम यादृच्छिक ID से गिना जाता है: कोई खाता या व्यक्तिगत विवरण नहीं।',
 'Daily shloka':'आज का श्लोक','A new shloka card every day, with its short meaning, ready to save and share in English, Hindi or Telugu.':'हर दिन एक नया श्लोक कार्ड, संक्षिप्त अर्थ सहित, अंग्रेज़ी, हिंदी या तेलुगु में सहेजने और साझा करने के लिए तैयार।','⬇ Download card':'⬇ कार्ड डाउनलोड करें','Open card':'कार्ड खोलें',
 'Support Gitopadesh':'गीतोपदेश को सहयोग दें','This is a personal project, not a business. If it has helped you and you can contribute, a voluntary gift helps keep it reliable and useful for everyone.':'यह एक व्यक्तिगत प्रोजेक्ट है, कोई व्यवसाय नहीं। यदि इससे आपको लाभ हुआ है और आप सहयोग कर सकते हैं, तो एक स्वैच्छिक उपहार इसे सबके लिए भरोसेमंद और उपयोगी बनाए रखने में सहायक होता है।','Suggestions and ideas:':'सुझाव और विचार:','Donate now':'अभी सहयोग करें','♡ Support':'♡ सहयोग','Support':'सहयोग',
 'Translation prepared with AI from the Sanskrit. Please confirm with a teacher or a printed edition for study.':'यह अनुवाद संस्कृत से AI की सहायता से तैयार किया गया है। अध्ययन के लिए कृपया किसी गुरु या मुद्रित संस्करण से पुष्टि कीजिए।'
},
te:{
 'Every Arjuna needs a charioteer':'ప్రతి అర్జునుడికి ఒక సారథి కావాలి',
 'Speak what weighs on your heart. He listens, asks, then shows the right path from the Bhagavad Gītā.':'మీ మనసులోని భారాన్ని చెప్పండి. ఆయన వింటాడు, అడుగుతాడు, ఆపై భగవద్గీత నుండి సరైన మార్గాన్ని చూపిస్తాడు.',
 'Tap the mic and speak to Krishna, or write here…':'మైక్ నొక్కి కృష్ణుడితో మాట్లాడండి, లేదా ఇక్కడ రాయండి…',
 'Ask Krishna':'కృష్ణుడిని అడగండి',
 'Not sure how to begin? Try one of these':'ఎలా మొదలుపెట్టాలో తెలియదా? వీటిలో ఒకటి ప్రయత్నించండి',
 '↺ New conversation':'↺ కొత్త సంభాషణ',
 'Speak':'చెప్పండి','Be understood':'అర్థం చేసుకోబడండి','Receive the verse':'శ్లోకం పొందండి','Walk the path':'మార్గంలో నడవండి',
 'History':'చరిత్ర','Library':'శ్లోకాలు','Saved':'సేవ్ చేసినవి',
 'The Gītā, verse by verse':'గీత, శ్లోకం శ్లోకంగా',
 'Eighteen chapters, 701 verses, each with its Sanskrit, transliteration and word-by-word meaning. Search by word, theme or number, like 2.47.':'పద్దెనిమిది అధ్యాయాలు, 701 శ్లోకాలు: ప్రతిదానికి సంస్కృత పాఠం, లిప్యంతరీకరణ, పదార్థాలు. పదం, అంశం లేదా సంఖ్య (ఉదా. 2.47) ద్వారా వెతకండి.',
 'Search: fear, 2.47, detachment, ‘fruit of action’…':'వెతకండి: భయం, 2.47, వైరాగ్యం, ‘కర్మఫలం’…',
 'Verses you kept':'మీరు సేవ్ చేసిన శ్లోకాలు',
 'Saved only in this browser.':'ఈ బ్రౌజర్‌లో మాత్రమే సేవ్ చేయబడ్డాయి.',
 'Tap ♡ on any verse to keep it here.':'ఏ శ్లోకం పైనైనా ♡ నొక్కండి, అది ఇక్కడ ఉంటుంది.',
 'How Krishna guides you here':'ఇక్కడ కృష్ణుడు మిమ్మల్ని ఎలా నడిపిస్తాడు',
 'The same way he guided Arjuna on the field of Kurukshetra: first he listened.':'కురుక్షేత్ర యుద్ధభూమిలో అర్జునుడిని నడిపించినట్లే: ముందు ఆయన విన్నాడు.',
 'He listens first':'ఆయన ముందు వింటాడు',
 'Speak or type. If your words are brief, Krishna reflects what he heard and asks one gentle question before he teaches.':'మాట్లాడండి లేదా రాయండి. మీ మాటలు తక్కువగా ఉంటే, కృష్ణుడు విన్నదాన్ని ప్రతిబింబించి, బోధించే ముందు ఒక సున్నితమైన ప్రశ్న అడుగుతాడు.',
 'One verse, chosen for you':'మీ కోసం ఎంచుకున్న ఒక శ్లోకం',
 'Your words are matched against all 701 verses. The Sanskrit and transliteration come from the Gītā itself. The English, Hindi and Telugu meanings are translations; the Hindi and Telugu were prepared with AI and reviewed against the Sanskrit.':'మీ మాటలను మొత్తం 701 శ్లోకాలతో పోల్చి చూస్తాం. సంస్కృత పాఠం, లిప్యంతరీకరణ గీత నుండే. ఆంగ్లం, హిందీ, తెలుగు అర్థాలు అనువాదాలు; హిందీ, తెలుగు అనువాదాలు AI సహాయంతో తయారుచేసి సంస్కృతంతో సరిచూశాం.',
 'Three languages':'మూడు భాషలు',
 'English, हिंदी and తెలుగు. The shlokas are in Sanskrit, shown in Devanagari, or in Telugu script when Telugu is chosen.':'ఆంగ్లం, హిందీ, తెలుగు. శ్లోకాలు సంస్కృతంలో ఉంటాయి; తెలుగు ఎంచుకుంటే తెలుగు లిపిలో కనిపిస్తాయి.',
 'Keep and share':'దాచుకోండి, పంచుకోండి',
 'Turn any verse into a 1080×1080 shloka card, save it, and return to it. Your saved verses stay on your device.':'ఏ శ్లోకాన్నైనా 1080×1080 శ్లోక కార్డుగా మార్చండి, సేవ్ చేయండి, మళ్లీ చూడండి. మీ సేవ్ చేసిన శ్లోకాలు మీ పరికరంలోనే ఉంటాయి.',
 'Questions, answered':'ప్రశ్నలు, సమాధానాలు',
 'What people ask before they begin.':'ప్రారంభించే ముందు ప్రజలు అడిగేవి.',
 'All eighteen chapters':'పద్దెనిమిది అధ్యాయాలు',
 'Read every verse with its meaning.':'ప్రతి శ్లోకాన్ని అర్థంతో చదవండి.',
 'About the maker':'తయారీదారు గురించి',
 'Hi, I’m Madhan. I build Gitopadesh as a quiet place to bring a hard question and hear the Gītā answer it. See my other projects and say hello on my portfolio.':'నమస్కారం, నేను Madhan ని. కఠినమైన ప్రశ్నను తీసుకువచ్చి గీత నుండి సమాధానం వినడానికి ఒక ప్రశాంత స్థలంగా గీతోపదేశ్‌ను నిర్మించాను. నా ఇతర ప్రాజెక్టులను చూడండి, నా పోర్ట్‌ఫోలియోలో హలో చెప్పండి.',
 'Gitopadesh offers reflections drawn from the Bhagavad Gītā. It is not medical, legal or mental-health advice. If you are in crisis, contact a local helpline or someone you trust now.':'గీతోపదేశ్ భగవద్గీత నుండి గ్రహించిన ఆలోచనలను అందిస్తుంది. ఇది వైద్య, న్యాయ లేదా మానసిక ఆరోగ్య సలహా కాదు. మీరు సంక్షోభంలో ఉంటే, వెంటనే స్థానిక హెల్ప్‌లైన్‌ను లేదా మీరు నమ్మే వ్యక్తిని సంప్రదించండి.',
 'Your words are sent to Amazon Bedrock to write Krishna’s reply, and each sentence he speaks is sent to Microsoft’s speech service. Gitopadesh does not store them; your conversation history stays only in your browser.':'కృష్ణుడి సమాధానం రాయడానికి మీ మాటలు Amazon Bedrock కు పంపబడతాయి, ఆయన మాట్లాడే ప్రతి వాక్యం మాటగా మార్చడానికి Microsoft స్పీచ్ సేవకు పంపబడుతుంది. గీతోపదేశ్ వాటిని నిల్వ చేయదు; మీ సంభాషణ చరిత్ర మీ బ్రౌజర్‌లో మాత్రమే ఉంటుంది.',
 'Gitopadesh needs JavaScript for the voice conversation. You can still read every verse from the chapter links above.':'స్వర సంభాషణకు గీతోపదేశ్‌కు JavaScript అవసరం. పై అధ్యాయ లింకుల నుండి మీరు ప్రతి శ్లోకాన్ని చదవవచ్చు.',
 'Read the full teaching ↓':'పూర్తి ఉపదేశం చదవండి ↓',
 'All':'అన్నీ','Show more':'మరిన్ని చూపండి','Nothing here yet.':'ఇక్కడ ఇంకా ఏమీ లేదు.',
 'You':'మీరు','Chapter':'అధ్యాయం','Verse':'శ్లోకం','Bhagavad Gītā':'భగవద్గీత','Word by word':'పదార్థాలు','Pronunciation':'ఉచ్చారణ',
 'Shloka card':'శ్లోక కార్డు','Midnight':'అర్ధరాత్రి','Saffron':'కాషాయం','Lotus':'కమలం',
 '⬇ Download 1080×1080':'⬇ 1080×1080 డౌన్‌లోడ్','♡ Save':'♡ సేవ్','♥ Saved':'♥ సేవ్ అయింది','⧉ Copy verse':'⧉ శ్లోకం కాపీ','Next verse ➜':'తదుపరి శ్లోకం ➜',
 '🕉 Recite shloka':'🕉 శ్లోకం వినండి','📖 Teach me this shloka':'📖 ఈ శ్లోకాన్ని బోధించండి','🖼 Shloka card':'🖼 శ్లోక కార్డు','⧉ Copy':'⧉ కాపీ','♡ Save verse':'♡ శ్లోకం సేవ్','🔊 Listen':'🔊 వినండి',
 '🔊 Listen to the lesson':'🔊 పాఠం వినండి','Delete':'తొలగించు',
 'Verse of the moment':'ఈ క్షణపు శ్లోకం','🪷 Another verse':'🪷 మరో శ్లోకం','Open shloka card':'శ్లోక కార్డు తెరవండి',
 'Your conversations':'మీ సంభాషణలు','Kept only in this browser. Nothing is stored on a server.':'ఈ బ్రౌజర్‌లో మాత్రమే ఉంచబడతాయి. సర్వర్‌లో ఏదీ నిల్వ చేయబడదు.',
 'No conversations yet. Speak to Krishna and they will appear here.':'ఇంకా సంభాషణలు లేవు. కృష్ణుడితో మాట్లాడండి, అవి ఇక్కడ కనిపిస్తాయి.',
 'Clear all history':'చరిత్ర మొత్తం తొలగించు','Tap again to confirm':'నిర్ధారించడానికి మళ్లీ నొక్కండి','← All conversations':'← అన్ని సంభాషణలు',
 'Krishna asked':'కృష్ణుడు అడిగాడు','Teaching':'ఉపదేశం','Dialogue':'సంభాషణ',
 'Copied':'కాపీ అయింది','Saved ♥':'సేవ్ అయింది ♥','Removed':'తొలగించబడింది','History cleared':'చరిత్ర తొలగించబడింది','A new conversation begins':'కొత్త సంభాషణ ప్రారంభమైంది',
 'Speak or type what is on your heart 🙏':'మీ మనసులోని మాట చెప్పండి లేదా రాయండి 🙏',
 'Krishna rests a moment. Please try again in a minute.':'కృష్ణుడు కొద్దిసేపు విశ్రాంతి తీసుకుంటున్నాడు. దయచేసి ఒక నిమిషం తర్వాత మళ్లీ ప్రయత్నించండి.',
 'Many seekers are here today. Showing the offline guide.':'ఈరోజు చాలా మంది సాధకులు ఉన్నారు. ఆఫ్‌లైన్ మార్గదర్శనం చూపిస్తున్నాం.',
 'Krishna’s cloud voice is unreachable. Showing the offline guide.':'కృష్ణుడి క్లౌడ్ స్వరం ఇప్పుడు అందుబాటులో లేదు. ఆఫ్‌లైన్ మార్గదర్శనం చూపిస్తున్నాం.',
 'Reciting the shloka… ॐ':'శ్లోకం పఠిస్తున్నాం… ఓం','The lesson is still being prepared':'పాఠం ఇంకా సిద్ధమవుతోంది',
 'The full lesson is unavailable right now. Showing the meaning.':'పూర్తి పాఠం ఇప్పుడు అందుబాటులో లేదు. అర్థం చూపిస్తున్నాం.',
 'Sending to Krishna… tap the box to edit':'కృష్ణుడికి పంపుతున్నాం… మార్చడానికి పెట్టెను నొక్కండి',
 'Voice input needs Chrome, Edge or Safari. You can still type.':'స్వర ఇన్‌పుట్‌కు Chrome, Edge లేదా Safari కావాలి. మీరు రాయవచ్చు.',
 'Hands-free paused. Tap the mic when ready.':'హ్యాండ్స్-ఫ్రీ ఆగింది. సిద్ధమైనప్పుడు మైక్ నొక్కండి.',
 'Listening… speak freely. I wait while you pause.':'వింటున్నాను… స్వేచ్ఛగా మాట్లాడండి. మీరు ఆగితే నేను ఎదురుచూస్తాను.',
 'Krishna is listening to what you said…':'కృష్ణుడు మీ మాటలు వింటున్నాడు…',
 'I could not hear that clearly. Please try again or type.':'నాకు స్పష్టంగా వినిపించలేదు. దయచేసి మళ్లీ చెప్పండి లేదా రాయండి.',
 'Hands-free on: Krishna will listen again after he speaks':'హ్యాండ్స్-ఫ్రీ ఆన్: మాట్లాడిన తర్వాత కృష్ణుడు మళ్లీ వింటాడు','Hands-free off':'హ్యాండ్స్-ఫ్రీ ఆఫ్',
 'Allow the microphone so Krishna can hear you.':'కృష్ణుడు మీ మాట వినడానికి మైక్రోఫోన్‌ను అనుమతించండి.',
 'I heard nothing. Tap the mic and speak again.':'ఏమీ వినిపించలేదు. మైక్ నొక్కి మళ్లీ మాట్లాడండి.',
 'The speech service is unreachable. Please type instead.':'స్పీచ్ సేవ అందుబాటులో లేదు. దయచేసి రాయండి.','No microphone was found.':'మైక్రోఫోన్ కనిపించలేదు.',
 'Krishna will answer in हिंदी':'కృష్ణుడు హిందీలో సమాధానం ఇస్తాడు','Krishna will answer in తెలుగు':'కృష్ణుడు తెలుగులో సమాధానం ఇస్తాడు',
 'Close':'మూసివేయి','Home':'హోమ్',
 'Card copied. Paste it into the WhatsApp chat.':'కార్డు కాపీ అయింది. WhatsApp చాట్‌లో పేస్ట్ చేయండి.','Card saved. Attach it in WhatsApp.':'కార్డు సేవ్ అయింది. WhatsAppలో జతచేయండి.',
 '📲 Share':'📲 పంచుకోండి','Copy link':'లింక్ కాపీ','Link copied':'లింక్ కాపీ అయింది',
 'Listening… take your time. I keep listening through your pauses. Tap the mic when you are done, then press Ask Krishna.':'వింటున్నాను… నిదానంగా చెప్పండి. మీరు ఆగినా నేను వింటూనే ఉంటాను. చెప్పడం పూర్తయ్యాక మైక్ నొక్కి, ఆపై “కృష్ణుడిని అడగండి” నొక్కండి.','Tap the mic when you want to continue.':'కొనసాగించాలనుకున్నప్పుడు మైక్ నొక్కండి.',
 'Krishna is taking longer than usual. Showing the quick guide.':'కృష్ణుడికి సాధారణం కంటే ఎక్కువ సమయం పడుతోంది. త్వరిత మార్గదర్శనం చూపిస్తున్నాం.','The lesson is taking longer than usual. Showing the meaning.':'పాఠానికి సాధారణం కంటే ఎక్కువ సమయం పడుతోంది. అర్థం చూపిస్తున్నాం.','Something went wrong. Please try again.':'ఏదో తప్పు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
 'visitors':'సందర్శకులు','online now':'ఇప్పుడు ఆన్‌లైన్','Counted with an anonymous random ID: no account or personal details.':'అజ్ఞాత యాదృచ్ఛిక IDతో లెక్కించబడుతుంది: ఖాతా లేదా వ్యక్తిగత వివరాలు లేవు.',
 'Daily shloka':'నేటి శ్లోకం','A new shloka card every day, with its short meaning, ready to save and share in English, Hindi or Telugu.':'ప్రతిరోజూ ఒక కొత్త శ్లోక కార్డు, దాని సంక్షిప్త అర్థంతో, ఆంగ్లం, హిందీ లేదా తెలుగులో సేవ్ చేసి పంచుకోవడానికి సిద్ధం.','⬇ Download card':'⬇ కార్డు డౌన్‌లోడ్','Open card':'కార్డు తెరవండి',
 'Support Gitopadesh':'గీతోపదేశ్‌కు మద్దతు ఇవ్వండి','This is a personal project, not a business. If it has helped you and you can contribute, a voluntary gift helps keep it reliable and useful for everyone.':'ఇది ఒక వ్యక్తిగత ప్రాజెక్ట్, వ్యాపారం కాదు. ఇది మీకు సహాయపడి, మీరు సహకరించగలిగితే, స్వచ్ఛంద బహుమతి దీన్ని అందరికీ నమ్మదగినదిగా, ఉపయోగకరంగా ఉంచడానికి తోడ్పడుతుంది.','Suggestions and ideas:':'సూచనలు, ఆలోచనలు:','Donate now':'ఇప్పుడే విరాళం ఇవ్వండి','♡ Support':'♡ మద్దతు','Support':'మద్దతు',
 'Translation prepared with AI from the Sanskrit. Please confirm with a teacher or a printed edition for study.':'ఈ అనువాదం సంస్కృతం నుండి AI సహాయంతో తయారైంది. అధ్యయనానికి దయచేసి గురువు లేదా ముద్రిత గ్రంథంతో సరిచూసుకోండి.'
}};
const tx=s=>(TX[lang]&&TX[lang][s])||s;

/* nav / button labels that carry state */
const STATE_L={
 en:{on:'on',off:'off',speaks:'Krishna speaks',flute:'Flute',convo:'Conversation',voice:'Voice',styles:{calm:'Calm',natural:'Natural',deep:'Deep',device:'Device'}},
 hi:{on:'चालू',off:'बंद',speaks:'कृष्ण बोलते हैं',flute:'बाँसुरी',convo:'संवाद',voice:'स्वर',styles:{calm:'शांत',natural:'स्वाभाविक',deep:'गहरा',device:'डिवाइस'}},
 te:{on:'ఆన్',off:'ఆఫ్',speaks:'కృష్ణుడు మాట్లాడతాడు',flute:'వేణువు',convo:'సంభాషణ',voice:'స్వరం',styles:{calm:'ప్రశాంతం',natural:'సహజం',deep:'గంభీరం',device:'పరికరం'}}};
function SL(){return STATE_L[lang]||STATE_L.en}

/* chapters and themes */
const CH_NAMES={
 hi:['अर्जुनविषादयोग','सांख्ययोग','कर्मयोग','ज्ञानकर्मसंन्यासयोग','कर्मसंन्यासयोग','ध्यानयोग','ज्ञानविज्ञानयोग','अक्षरब्रह्मयोग','राजविद्याराजगुह्ययोग','विभूतियोग','विश्वरूपदर्शनयोग','भक्तियोग','क्षेत्रक्षेत्रज्ञविभागयोग','गुणत्रयविभागयोग','पुरुषोत्तमयोग','दैवासुरसम्पद्विभागयोग','श्रद्धात्रयविभागयोग','मोक्षसंन्यासयोग'],
 te:['అర్జునవిషాదయోగం','సాంఖ్యయోగం','కర్మయోగం','జ్ఞానకర్మసన్యాసయోగం','కర్మసన్యాసయోగం','ధ్యానయోగం','జ్ఞానవిజ్ఞానయోగం','అక్షరబ్రహ్మయోగం','రాజవిద్యారాజగుహ్యయోగం','విభూతియోగం','విశ్వరూపసందర్శనయోగం','భక్తియోగం','క్షేత్రక్షేత్రజ్ఞవిభాగయోగం','గుణత్రయవిభాగయోగం','పురుషోత్తమయోగం','దైవాసురసంపద్విభాగయోగం','శ్రద్ధాత్రయవిభాగయోగం','మోక్షసన్యాసయోగం']};
const THEME_NAMES={
 hi:{soul:'आत्मा',action:'क्रिया',god:'ईश्वर',duty:'कर्तव्य',mind:'मन',body:'शरीर',time:'काल',pleasure:'सुख',death:'मृत्यु',wisdom:'ज्ञान',detachment:'वैराग्य',nature:'प्रकृति',world:'संसार',sacrifice:'यज्ञ',devotion:'भक्ति',karma:'कर्म',strength:'शक्ति',war:'युद्ध',renunciation:'संन्यास',desire:'कामना',anger:'क्रोध',control:'संयम',meditation:'ध्यान',confusion:'भ्रम',ignorance:'अज्ञान',compassion:'करुणा',equality:'समता',peace:'शांति',grief:'शोक',suffering:'दुःख',fear:'भय',liberation:'मोक्ष'},
 te:{soul:'ఆత్మ',action:'క్రియ',god:'దేవుడు',duty:'కర్తవ్యం',mind:'మనస్సు',body:'శరీరం',time:'కాలం',pleasure:'సుఖం',death:'మృత్యువు',wisdom:'జ్ఞానం',detachment:'వైరాగ్యం',nature:'ప్రకృతి',world:'లోకం',sacrifice:'యజ్ఞం',devotion:'భక్తి',karma:'కర్మ',strength:'శక్తి',war:'యుద్ధం',renunciation:'సన్యాసం',desire:'కోరిక',anger:'క్రోధం',control:'నిగ్రహం',meditation:'ధ్యానం',confusion:'భ్రమ',ignorance:'అజ్ఞానం',compassion:'కరుణ',equality:'సమత్వం',peace:'శాంతి',grief:'శోకం',suffering:'దుఃఖం',fear:'భయం',liberation:'మోక్షం'}};
function themeName(t){return (THEME_NAMES[lang]&&THEME_NAMES[lang][t])||t}


function UVACHA(){return lang==='te'?'॥ శ్రీభగవానువాచ ॥':'॥ श्रीभगवानुवाच ॥'}

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const id=v=>v.chapter+'.'+v.verse, byId=Object.fromEntries(VERSES.map(v=>[id(v),v]));
const clean=v=>{const s=v.sanskrit.replace(/\s*[।॥]*\s*\d+\.\d+\s*[।॥]*\s*$/,'');return lang==='te'?toTelugu(s):s};
const ss={get(k,d){try{return JSON.parse(sessionStorage.getItem(k))??d}catch{return d}},set(k,v){try{sessionStorage.setItem(k,JSON.stringify(v))}catch{}}};
let lang=store.get('lang','en'), saved=new Set(store.get('saved',[])), cardTheme=0, hasLLM=false, speakOn=store.get('speak',true), history=ss.get('ctx',[]), busy=false;
let i18nReady=false;

/* ---------- Starry sky ---------- */
(()=>{const c=$('#sky'),x=c.getContext('2d');let W,H,S=[],mx=0,my=0,lt=0;
 const rs=()=>{W=c.width=innerWidth;H=c.height=innerHeight;S=Array.from({length:Math.min(140,W/8)},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.5+.3,p:Math.random()*6,s:Math.random()*.0004+.0001}))};
 addEventListener('resize',rs);rs();addEventListener('pointermove',e=>{mx=e.clientX/W-.5;my=e.clientY/H-.5});
 (function f(t){if(lt&&t-lt<(MOBILE?120:30)){requestAnimationFrame(f);return}lt=t;x.clearRect(0,0,W,H);const dark=document.documentElement.dataset.theme!=='light';
  S.forEach(s=>{const a=.4+.6*Math.abs(Math.sin(t*s.s*8+s.p));x.fillStyle=dark?`rgba(255,230,170,${a})`:`rgba(168,102,26,${a*.35})`;x.beginPath();x.arc(s.x+mx*s.r*18,s.y+my*s.r*18,s.r,0,7);x.fill()});
  requestAnimationFrame(f)})(0)})();

/* ---------- Retrieval over all 701 verses ---------- */
const STOP=new Set('the a an and or of to in on for with is are was be i me my you your it that this at as by from not but so do have has am can will just about what how when why who which if then than into out up we our they their them he she his her'.split(' '));
const tok=s=>(s.toLowerCase().match(/[a-zāīūṛṣśṇṭḍ']+/g)||[]).filter(w=>w.length>2&&!STOP.has(w));
const stem=w=>w.replace(/(ing|ed|es|s|ly)$/,'');
const df={};VERSES.forEach(v=>{v._t=new Map();tok(v.translation+' '+v.themes.join(' ')).map(stem).forEach(w=>v._t.set(w,(v._t.get(w)||0)+1));v._t.forEach((_,w)=>df[w]=(df[w]||0)+1)});
const idf=w=>Math.log(1+VERSES.length/(1+(df[w]||0)));
const MOODS={
 grief:{kw:'lost loss died death dead grief grieving breakup broke heartbroken sad cry crying depressed lonely alone miss mourning passed widow',th:['grief','death','suffering','soul'],an:['2.11','2.13','2.14','2.20','2.22','2.27']},
 fear:{kw:'afraid fear scared fail failure failing exam exams interview nervous terrified future uncertain risk worry reject rejected judged',th:['fear','strength','devotion'],an:['2.40','2.56','18.66','9.22','4.10']},
 anger:{kw:'angry anger hate hatred rage betrayed betray revenge jealous jealousy resent furious irritated bitter envy',th:['anger','control','desire'],an:['2.62','2.63','3.37','16.21','2.56']},
 work:{kw:'job career work boss duty responsibility result results goal study exam effort success promotion business salary deadline outcome ambition procrastinate lazy',th:['action','duty','karma','detachment'],an:['2.47','2.48','3.19','3.35','18.46','3.8']},
 confusion:{kw:'confused confusion decision decide choose dilemma lost direction purpose doubt path stuck unsure torn crossroads',th:['confusion','wisdom','duty'],an:['18.73','18.66','2.7','3.2','4.42','18.63']},
 desire:{kw:'want crave craving addiction addicted lust money greed phone social scrolling attachment obsessed temptation pleasure habit',th:['desire','pleasure','detachment','control'],an:['2.70','2.62','2.71','3.37','5.22','2.67']},
 mind:{kw:'anxiety anxious stress stressed overthinking overthink focus distracted sleep restless panic burnout mind thoughts meditation overwhelmed tired',th:['mind','control','meditation','peace'],an:['6.5','6.6','6.35','6.26','2.66','6.17']},
 peace:{kw:'peace calm happiness happy content joy meaning spiritual god faith grateful hope bliss',th:['peace','devotion','equality'],an:['2.71','12.13','5.29','6.7','2.66']},
 general:{kw:'',th:['wisdom','soul'],an:['2.47','2.14','4.7','18.66','2.20']}
};
function classify(text){const w=new Set(tok(text));let best='general',n=0;
 for(const[m,o]of Object.entries(MOODS)){if(m==='general')continue;const c=o.kw.split(' ').filter(k=>w.has(k)).length;if(c>n){n=c;best=m}}return best}
function retrieve(text,mood,n=4){
 const q=tok(text).map(stem),M=MOODS[mood];
 return VERSES.map(v=>{let s=0;q.forEach(w=>{if(v._t.has(w))s+=idf(w)*(1+Math.log(v._t.get(w)))});
  s=s/Math.sqrt(v._t.size+5)*4;
  M.th.forEach((t,i)=>{if(v.themes.includes(t))s+=1.2-i*.15});
  if(M.an.includes(id(v)))s+=3.5;
  return[v,s+Math.random()*.15]}).sort((a,b)=>b[1]-a[1]).slice(0,n).map(x=>x[0]);
}

/* ---------- Offline guide (used when no Bedrock keys) ---------- */
const T={
en:{h:{SEE:'I see you',FIELD:'The battlefield',VERSE:'The verse I give you',PATH:'The way forward',SELF:'Remember who you are',ASK:'Tell me',SAY:'Krishna says'},
 bridge:'Just as Arjuna stood trembling, bow slipping from his hands, between love and duty, so you stand now at your own Kurukshetra. The field is not outside you; it is every choice that asks for your courage.',
 last:'You are not this body, nor this passing storm of thought. You are the eternal Self — unborn, undying, untouched by victory or defeat. Rise.',
 open:['O seeker,','Dear one,','O Pārtha of this age,'],
 mood:{
  grief:['I see the tears you hide, and I do not turn away. Grief is love that has lost its address; it is no weakness, and it is not the end.','Hold what has passed with gratitude, not with clenched fists. What is born will pass and what passes is not destroyed — only the form changes. Let yourself weep, then do one kind act today for someone living.'],
  fear:['I see the trembling beneath your calm face. The fear of failure sits heavy on the one who counts only outcomes.','Give your whole effort to the task before you, and leave the harvest to Me. Prepare with devotion, act without clutching the result, and let each small step today be your offering.'],
  anger:['I see the fire in you. Anger is the pain of a wound that wishes to wound back — and it burns the one who carries it first.','Pause before you answer; let one breath pass between the sting and the word. Do not suppress the anger, but turn its energy into righteous action — a boundary, an honest conversation — never into revenge.'],
  work:['I see how tightly you hold the fruits of your labour, and how that grip steals the joy from the labour itself.','Do your duty fully, as an offering, with attention on the work and not on the applause. Choose the one task that matters most today, finish it with care, and release the outcome.'],
  confusion:['I see the crossroads and the fog. Even the greatest archer once laid down his bow because he could not tell right from wrong.','Be still and ask what your own dharma — your honest duty and nature — requires, not what others expect. Take counsel from the wise, then take the next step; clarity comes by walking, not by waiting.'],
  desire:['I see the pull in you — the craving that promises everything and delivers hunger. Desire is a flame that grows on the very fuel you feed it.','Do not wage war on the craving; starve it gently. Notice the urge, name it, wait ten breaths, and turn the attention to something nourishing. Master the senses and they become servants, not masters.'],
  mind:['I see the restless mind racing ahead to dangers that have not come. The mind is a friend to the one who tames it, and a foe to the one who does not.','Practise daily: sit in stillness, let the breath be your anchor, and each time the mind wanders, bring it gently back. Steady practice and non-attachment — these two will tame it.'],
  peace:['I see a heart already turning toward the light. The longing for peace is My own call within you.','Peace is not found in changed circumstance but in an unshaken centre. Serve without keeping score, be grateful for the moment, and offer your actions to something higher than yourself.'],
  general:['I see you, and I know the weight you carry. You are not alone on this field — I have always been the charioteer of your life.','Take one honest action today aligned with your duty, free from anxiety about the result. Seek stillness each morning, and the next step will reveal itself.']
 },
 talk:'I hear you, dear one. Offer this too at My feet: do the next right thing, and leave the rest to Me. Tell me, what is the one small step you can take before the sun sets?',
 expl:v=>`This is My word to you: “${v.translation.trim()}” Let it settle in you not as a rule, but as a light for the very situation you carry today.`},
hi:{h:{SEE:'मैं तुम्हें देखता हूँ',FIELD:'कुरुक्षेत्र',VERSE:'मेरा श्लोक',PATH:'आगे का मार्ग',SELF:'स्वयं को स्मरण करो',ASK:'मुझे बताओ',SAY:'कृष्ण कहते हैं'},
 bridge:'जैसे अर्जुन प्रेम और कर्तव्य के बीच काँपता खड़ा था, धनुष हाथ से छूट रहा था, वैसे ही आज तुम अपने कुरुक्षेत्र में खड़े हो। यह रणभूमि बाहर नहीं, तुम्हारे हर उस निर्णय में है जो साहस माँगता है।',
 last:'तुम यह शरीर नहीं, न ही विचारों का यह क्षणिक तूफ़ान हो। तुम अजन्मा, अविनाशी आत्मा हो — जय-पराजय से अछूते। उठो।',
 open:['हे साधक,','प्रिय,','हे पार्थ,'],
 mood:{
  grief:['मैं तुम्हारे छिपे आँसू देखता हूँ। शोक वह प्रेम है जिसका ठिकाना खो गया है; यह कमज़ोरी नहीं, और अंत भी नहीं।','जो बीत गया उसे कृतज्ञता से थामो, मुट्ठी भींचकर नहीं। जो जन्मा है वह जाएगा, और जो जाता है वह नष्ट नहीं होता — केवल रूप बदलता है। रो लो, फिर आज किसी जीवित व्यक्ति के लिए एक दयालु कर्म करो।'],
  fear:['मैं तुम्हारे शांत चेहरे के नीचे काँपन देखता हूँ। असफलता का भय उसी पर भारी होता है जो केवल परिणाम गिनता है।','अपना पूरा प्रयास सामने के कर्म को दो और फल मुझ पर छोड़ दो। भक्ति से तैयारी करो, परिणाम को मुट्ठी में मत जकड़ो, और आज का हर छोटा कदम अर्पण बना दो।'],
  anger:['मैं तुम्हारे भीतर की आग देखता हूँ। क्रोध उस घाव की पीड़ा है जो पलटकर घाव देना चाहता है — और वह पहले उसे ही जलाता है जो उसे ढोता है।','उत्तर देने से पहले ठहरो; चुभन और शब्द के बीच एक साँस आने दो। क्रोध को दबाओ मत, उसकी ऊर्जा को सही कर्म में लगाओ — एक सीमा, एक ईमानदार संवाद — बदले में नहीं।'],
  work:['मैं देखता हूँ कि तुम अपने श्रम के फल को कितना कसकर पकड़े हो, और वही पकड़ श्रम का आनंद छीन रही है।','अपना कर्तव्य पूरे मन से, अर्पण भाव से करो; ध्यान कर्म पर रहे, तालियों पर नहीं। आज सबसे महत्वपूर्ण एक कार्य चुनो, उसे लगन से पूरा करो और परिणाम छोड़ दो।'],
  confusion:['मैं दोराहा और धुंध देखता हूँ। महान धनुर्धर ने भी धनुष रख दिया था क्योंकि वह उचित-अनुचित नहीं पहचान पा रहा था।','शांत होकर पूछो कि तुम्हारा अपना धर्म क्या माँगता है, दूसरों की अपेक्षा नहीं। ज्ञानियों से परामर्श लो, फिर अगला कदम उठाओ; स्पष्टता चलने से आती है।'],
  desire:['मैं तुम्हारे भीतर का खिंचाव देखता हूँ — वह तृष्णा जो सब कुछ का वादा करती है और भूख देती है।','तृष्णा से युद्ध मत करो, उसे धीरे से भूखा रखो। इच्छा को पहचानो, दस साँसें प्रतीक्षा करो और ध्यान किसी पोषक चीज़ की ओर मोड़ दो।'],
  mind:['मैं उस बेचैन मन को देखता हूँ जो उन खतरों की ओर दौड़ता है जो आए ही नहीं। मन वश में हो तो मित्र है, नहीं तो शत्रु।','प्रतिदिन अभ्यास करो: शांत बैठो, साँस को आधार बनाओ, और जब भी मन भटके उसे कोमलता से लौटा लाओ। अभ्यास और वैराग्य उसे साध लेंगे।'],
  peace:['मैं देखता हूँ कि तुम्हारा हृदय प्रकाश की ओर मुड़ चुका है। शांति की चाह तुम्हारे भीतर मेरी ही पुकार है।','शांति परिस्थिति बदलने से नहीं, अडिग केंद्र से मिलती है। हिसाब रखे बिना सेवा करो, इस क्षण के लिए आभारी रहो।'],
  general:['मैं तुम्हें देखता हूँ और तुम्हारा बोझ जानता हूँ। इस रणभूमि में तुम अकेले नहीं — मैं सदा तुम्हारे जीवन का सारथी हूँ।','आज अपने कर्तव्य के अनुरूप एक ईमानदार कर्म करो, परिणाम की चिंता के बिना। हर सुबह मौन में बैठो, अगला कदम स्वयं प्रकट होगा।']
 },
 talk:'मैं सुन रहा हूँ, प्रिय। अगला उचित कर्म करो और शेष मुझ पर छोड़ दो। बताओ, सूर्यास्त से पहले तुम कौन-सा एक छोटा कदम उठा सकते हो?',
 expl:v=>`यह तुम्हारे लिए मेरा वचन है — “${v.translation.trim()}” इसे नियम नहीं, आज की तुम्हारी स्थिति के लिए दीपक समझो।`},
te:{h:{SEE:'నేను నిన్ను చూస్తున్నాను',FIELD:'కురుక్షేత్రం',VERSE:'నా శ్లోకం',PATH:'ముందుకు మార్గం',SELF:'నీవెవరో గుర్తుంచుకో',ASK:'నాకు చెప్పు',SAY:'కృష్ణుడు అంటున్నాడు'},
 bridge:'ప్రేమ మరియు కర్తవ్యం మధ్య అర్జునుడు వణుకుతూ నిలబడినట్లే, ఈ రోజు నీవు నీ స్వంత కురుక్షేత్రంలో నిలబడి ఉన్నావు. ఆ యుద్ధభూమి బయట లేదు; ధైర్యం కోరే ప్రతి నిర్ణయంలోనే ఉంది.',
 last:'నీవు ఈ శరీరం కాదు, ఈ క్షణికమైన ఆలోచనల తుఫాను కాదు. నీవు జన్మలేని, నాశనం లేని ఆత్మవు — గెలుపు ఓటముల స్పర్శ లేనివాడివి. లే.',
 open:['ఓ సాధకా,','ప్రియమైనవాడా,','ఓ పార్థా,'],
 mood:{
  grief:['నీ దాచుకున్న కన్నీళ్లు నాకు కనిపిస్తున్నాయి. దుఃఖం అంటే చిరునామా కోల్పోయిన ప్రేమ; అది బలహీనత కాదు, అంతం కూడా కాదు.','గతించినదాన్ని కృతజ్ఞతతో పట్టుకో, పిడికిలి బిగించి కాదు. పుట్టినది పోతుంది, పోయినది నశించదు — రూపమే మారుతుంది. ఏడ్చు, తర్వాత ఈ రోజు బ్రతికున్న ఒకరికి దయతో ఒక పని చెయ్యి.'],
  fear:['నీ ప్రశాంత ముఖం వెనుక వణుకు నాకు కనిపిస్తోంది. ఫలితాలనే లెక్కించేవాడిపై వైఫల్య భయం బరువుగా పడుతుంది.','నీ పూర్తి శ్రమను ఎదుటి పనికి ఇవ్వు, ఫలాన్ని నాకు వదిలెయ్యి. భక్తితో సిద్ధమవ్వు, ఫలితాన్ని గట్టిగా పట్టుకోకు.'],
  anger:['నీలోని అగ్ని నాకు కనిపిస్తోంది. కోపం అంటే తిరిగి గాయపరచాలనుకునే గాయం బాధ — అది మోసేవాడినే ముందు దహిస్తుంది.','జవాబు చెప్పే ముందు ఆగు; బాధకూ మాటకూ మధ్య ఒక శ్వాస ఉండనివ్వు. కోపాన్ని అణచకు, దాని శక్తిని సరైన కర్మగా మలుచు — ప్రతీకారంగా కాదు.'],
  work:['నీ శ్రమ ఫలాన్ని నీవెంత గట్టిగా పట్టుకున్నావో, ఆ పట్టే శ్రమలోని ఆనందాన్ని దొంగిలిస్తోందో నాకు కనిపిస్తోంది.','నీ కర్తవ్యాన్ని అర్పణ భావంతో పూర్తిగా చెయ్యి; దృష్టి పనిపై ఉండాలి, చప్పట్లపై కాదు. ఈ రోజు అత్యంత ముఖ్యమైన ఒక పనిని పూర్తిచేసి ఫలితాన్ని వదిలెయ్యి.'],
  confusion:['నాకు నీ కూడలి, పొగమంచు కనిపిస్తున్నాయి. గొప్ప ధనుర్ధారి కూడా ధర్మాధర్మాలు తెలియక విల్లు వదిలాడు.','నిశ్చలంగా ఉండి నీ స్వధర్మం ఏమి కోరుతోందో అడుగు, ఇతరుల ఆశలను కాదు. జ్ఞానుల సలహా తీసుకొని తర్వాతి అడుగు వెయ్యి.'],
  desire:['నీలోని ఆకర్షణ నాకు కనిపిస్తోంది — అన్నీ వాగ్దానం చేసి ఆకలినే ఇచ్చే కోరిక.','కోరికతో యుద్ధం చెయ్యకు, దాన్ని మెల్లగా ఆకలిగొలుపు. ఆ తపనను గుర్తించి, పది శ్వాసలు ఆగి, దృష్టిని పోషకమైన దానిపైకి మళ్లించు.'],
  mind:['ఇంకా రాని ప్రమాదాల వైపు పరుగెత్తే నీ చంచల మనస్సు నాకు కనిపిస్తోంది. మనస్సును నియంత్రించినవాడికి అది మిత్రుడు.','ప్రతిరోజూ సాధన చెయ్యి: నిశ్శబ్దంగా కూర్చో, శ్వాసను ఆధారం చేసుకో, మనసు తిరిగినప్పుడల్లా మెల్లగా వెనక్కి తీసుకురా.'],
  peace:['నీ హృదయం ఇప్పటికే వెలుగు వైపు తిరిగిందని చూస్తున్నాను. శాంతి కోసం నీ తపన నీలో నా పిలుపే.','శాంతి పరిస్థితులు మారడంలో కాదు, చలించని కేంద్రంలో దొరుకుతుంది. లెక్కలు వేయకుండా సేవ చెయ్యి, ఈ క్షణానికి కృతజ్ఞతగా ఉండు.'],
  general:['నేను నిన్ను చూస్తున్నాను, నీ భారం తెలుసు. ఈ యుద్ధభూమిలో నీవు ఒంటరివి కావు — నేనెప్పుడూ నీ జీవిత సారథిని.','ఈ రోజు ఫలితం గురించిన ఆందోళన లేకుండా, నీ కర్తవ్యానికి అనుగుణంగా ఒక నిజాయితీ గల పని చెయ్యి.']
 },
 talk:'నేను వింటున్నాను, ప్రియా. తదుపరి సరైన పని చెయ్యి, మిగిలినది నాకు వదిలెయ్యి. సూర్యాస్తమయం లోపల నీవు వేయగల ఒక చిన్న అడుగు ఏది?',
 expl:v=>`ఇది నీ కోసం నా వాక్యం — “${v.translation.trim()}” దీన్ని నియమంగా కాక, ఈ రోజు నీ పరిస్థితికి వెలుగుగా భావించు.`}
};
function offlineParsed(text,cands,mood,isFirst){
 const L=T[lang];
 if(!isFirst)return{mode:'TALK',id:null,sec:{SAY:L.talk},done:true};
 const m=L.mood[mood],o=L.open[Math.floor(Math.random()*3)];
 return{mode:'TEACH',id:id(cands[0]),done:true,sec:{SEE:`${o} ${m[0]}`,FIELD:L.bridge,VERSE:L.expl(cands[0]),PATH:m[1],SELF:L.last}};
}

/* ---------- Stream parser + Krishna block renderer ---------- */
const ORDER={ASK:['SEE','ASK'],TEACH:['SEE','FIELD','VERSE','PATH','SELF'],TALK:['SAY']};
function parseStream(buf){
 const out={mode:null,id:null,sec:{},done:false};
 let m=buf.match(/MODE:\s*(ASK|TEACH|TALK)/);if(m)out.mode=m[1];
 m=buf.match(/VERSE_ID:\s*(\d+\.\d+)/);if(m)out.id=m[1];
 const re=/^[ \t]*##\s*(SEE|FIELD|VERSE|PATH|SELF|ASK|SAY|BHAVAM|WORDS|MEANING|STORY|TODAY|REMEMBER)[ \t]*$/gm,marks=[];let r;
 while((r=re.exec(buf)))marks.push({n:r[1],s:r.index,e:r.index+r[0].length});
 marks.forEach((k,i)=>{out.sec[k.n]=buf.slice(k.e,i+1<marks.length?marks[i+1].s:buf.length).trim()});
 if(!out.mode&&marks.length)out.mode=marks.some(k=>k.n==='SAY')?'TALK':'TEACH';
 return out;
}
function newKrishna(){
 const el=document.createElement('div');el.className='kr';
 el.innerHTML='<div class="who">'+UVACHA()+'</div><div class="body"><div class="dots"><span></span><span></span><span></span></div></div>';
 $('#thread').appendChild(el);return el;
}
function renderKrishna(el,p,candIds,streaming){
 const L=T[lang];if(!p.mode)return;setStage(p.mode==='ASK'?2:p.mode==='TEACH'?3:4);
 const body=el.querySelector('.body'),order=ORDER[p.mode];
 let vid=p.id&&byId[p.id]?p.id:candIds[0];
 if(!body.dataset.mode){body.dataset.mode=p.mode;body.innerHTML=order.map(k=>`<div class="step ${k==='ASK'?'ask':''}" data-k="${k}" style="display:none"><b>${L.h[k]}</b>${k==='VERSE'?'<div class="vblock"></div>':''}<p></p></div>`).join('')}
 let lastShown=null;
 order.forEach(k=>{const st=body.querySelector(`[data-k="${k}"]`),t=p.sec[k];
  if(t===undefined){return}
  st.style.display='';
  st.querySelector('p').textContent=t;
  if(k==='VERSE'&&p.id!==undefined&&!st.dataset.v){const v=byId[vid];if(v){st.dataset.v=vid;st.querySelector('.vblock').innerHTML=`<span class="cite">${tx('Bhagavad Gītā')} ${vid}</span><div class="shloka">${esc(clean(v))}</div><div class="translit">${esc(v.transliteration)}</div>`}}
  body.querySelectorAll('p').forEach(x=>x.classList.remove('caret'));lastShown=st;
 });
 if(lastShown&&streaming)lastShown.querySelector('p').classList.add('caret');
 {const lk=[...order].reverse().find(k=>p.sec[k]);if(lk&&!speakOn)setSubtitle(lastSentence(p.sec[lk]))}
 if(!streaming&&!el.dataset.fin){el.dataset.fin=1;
  const verse=p.mode==='TEACH'?byId[vid]:null,text=order.map(k=>p.sec[k]).filter(Boolean).join('\n\n');
  const a=document.createElement('div');a.className='actions';
  a.innerHTML=(verse?'<button class="pill" data-a="recite">'+tx('🕉 Recite shloka')+'</button><button class="pill" data-a="teach">'+tx('📖 Teach me this shloka')+'</button><button class="pill" data-a="card">'+tx('🖼 Shloka card')+'</button>':'')+'<button class="pill" data-a="copy">'+tx('⧉ Copy')+'</button>'+(verse?'<button class="pill" data-a="save">'+tx('♡ Save verse')+'</button>':'')+'<button class="pill" data-a="listen">'+tx('🔊 Listen')+'</button>';
  a.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const k=b.dataset.a;
   if(k==='card')openVerse(vid,true);if(k==='recite')reciteShloka(verse);if(k==='teach')openTeach(vid);if(k==='copy')navigator.clipboard?.writeText(text+'\n— Gitopadesh').then(()=>toast('Copied'));
   if(k==='save')toggleSave(vid);if(k==='listen')speak(text)};
  el.appendChild(a);
  history.push({role:'assistant',text:Object.entries(p.sec).map(([k,v])=>`##${k}\n${v}`).join('\n')});
  history[history.length-1].text=`MODE: ${p.mode}\n`+history[history.length-1].text;
 }
 if(verse_pending(p))return;
}
const verse_pending=()=>false;

/* ---------- Ask flow ---------- */
async function ask(text){
 text=(text||'').trim();if(!text){toast('Speak or type what is on your heart 🙏');return}
 if(busy)return;
 // whatever happens inside, the page is released: no spinner without end, no locked Ask button
 const wd=setTimeout(()=>{busy=false;$('#goBtn').disabled=false;if(document.body.dataset.state==='thinking')setState('idle')},130000);
 try{await askInner(text)}catch(e){console.error('ask failed',e);toast('Something went wrong. Please try again.')}
 finally{clearTimeout(wd);busy=false;$('#goBtn').disabled=false;if(!(window.speechSynthesis&&speechSynthesis.speaking)&&document.body.dataset.state==='thinking')setState('idle')}
}
async function askInner(text){
 text=(text||'').trim();if(!text){toast('Speak or type what is on your heart 🙏');return}
 audioInit();if(busy)return;{const dl=detectLang(text);if(dl&&dl!==lang){setLang(dl);toast(dl==='hi'?'Krishna will answer in हिंदी':'Krishna will answer in తెలుగు')}}busy=true;$('#goBtn').disabled=true;stopSpeak();micWanted=false;if(rec){try{rec.stop()}catch{}}
 $('#thread').innerHTML='';
 const me=document.createElement('div');me.className='me';const mk=document.createElement('small');mk.textContent=tx('You');const mt=document.createElement('span');mt.textContent=text;me.append(mk,mt);$('#thread').appendChild(me);
 $('#chariot').classList.add('show');$('#readMore').classList.remove('show');
 if(speakOn)$('#readMore').classList.add('show');else setTimeout(()=>me.scrollIntoView({behavior:'smooth',block:'start'}),60);
 $('#q').value='';autosize();
 const isFirst=!history.some(h=>h.role==='assistant'&&/MODE: (TEACH)/.test(h.text));
 const allUser=history.filter(h=>h.role==='user').map(h=>h.text).concat(text).join(' ');
 const mood=classify(allUser),cands=retrieve(allUser,mood,4),candIds=cands.map(id);
 const el=newKrishna();setState('thinking');setSubtitle('…');let liveSp=speakOn?startSpeaker():null;
 let parsed;
 const ac=new AbortController();let got=false;
 const tF=setTimeout(()=>{if(!got)ac.abort()},22000),tT=setTimeout(()=>ac.abort(),95000);   // no first word in 22s, or no end in 95s: switch to the quick guide
 try{
  if(!hasLLM)throw new Error('offline');
  const res=await fetch('/api/ask',{signal:ac.signal,method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,lang,history,mood,candidates:cands.map(v=>({id:id(v),translation:v.translation}))})});
  if(!res.ok||!res.body)throw new Error('http '+res.status);
  const rd=res.body.getReader(),dec=new TextDecoder();let buf='';
  while(true){const{done,value}=await rd.read();if(done)break;got=true;buf+=dec.decode(value,{stream:true});if(document.body.dataset.state==='thinking')setState('speaking');
   if(buf.includes('\0ERR'))throw new Error('bedrock');
   parsed=parseStream(buf);renderKrishna(el,parsed,candIds,true);if(liveSp)liveSp.feed(parsed,false)}
  parsed=parseStream(buf);if(!parsed.mode)throw new Error('format');
  clearTimeout(tF);clearTimeout(tT);
 }catch(err){
  clearTimeout(tF);clearTimeout(tT);
  console.warn('falling back to offline guide:',err.message);
  if(err.message!=='offline')toast(err.name==='AbortError'?'Krishna is taking longer than usual. Showing the quick guide.':/429/.test(err.message)?'Krishna rests a moment. Please try again in a minute.':/503/.test(err.message)?'Many seekers are here today. Showing the offline guide.':'Krishna’s cloud voice is unreachable. Showing the offline guide.');
  el.querySelector('.body').removeAttribute('data-mode');
  if(liveSp){liveSp.cancel();liveSp=speakOn?startSpeaker():null}
  parsed=offlineParsed(text,cands,mood,isFirst);
 }
 history.push({role:'user',text});
 // keep user turn before assistant turn in history order
 const a=history.pop();history.splice(history.length,0,a);
 renderKrishna(el,parsed,candIds,false);
 if(liveSp){liveSp.feed(parsed,true);liveSp.end()}
 // reorder: assistant entry was pushed inside renderKrishna after user push? ensure alternating
 history=history.filter(Boolean);
 {const vid=parsed.id&&byId[parsed.id]?parsed.id:candIds[0];saveExchange({t:Date.now(),q:text,mode:parsed.mode,vid:parsed.mode==='TEACH'?vid:null,sec:parsed.sec,lang});history=history.slice(-12);ss.set('ctx',history)}
 if(!(window.speechSynthesis&&speechSynthesis.speaking))setState('idle');busy=false;$('#goBtn').disabled=false;
}

/* ---------- Voice in (speak your problem) ---------- */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition,LOCALE={en:'en-IN',hi:'hi-IN',te:'te-IN'};
let rec=null,recText='';

/* ---------- Voice out (Krishna speaks) ---------- */
let voices=[];const loadV=()=>voices=speechSynthesis.getVoices();if('speechSynthesis'in window){loadV();speechSynthesis.onvoiceschanged=loadV}
// Prefer deep, natural MALE Indian neural voices (Edge ships Prabhat/Madhur/Mohan for free).
const MALE=/prabhat|madhur|mohan|ravi|hemant|rishi|male|google (hindi|telugu)|kalyani/i, NOTMALE=/swara|neerja|kajal|shruti|female|heera|aditi|raveena/i;
function pickVoice(l=lang){const loc=LOCALE[l],pool=voices.filter(v=>v.lang.replace('_','-').toLowerCase().startsWith(l));
 const exact=pool.filter(v=>v.lang.replace('_','-')===loc);const all=exact.length?exact:pool;
 return all.find(v=>/natural|online/i.test(v.name)&&MALE.test(v.name)&&!NOTMALE.test(v.name))||all.find(v=>MALE.test(v.name)&&!NOTMALE.test(v.name))||all.find(v=>/natural|online/i.test(v.name))||all[0]||null}
function browserSpeak(text){
 if(!('speechSynthesis'in window))return;stopSpeak();
 const parts=text.replace(/[#*_]/g,'').split(/(?<=[.!?।॥])\s+|\n+/).map(s=>s.trim()).filter(Boolean),vo=pickVoice();
 parts.forEach((s,i)=>{const u=new SpeechSynthesisUtterance(s);u.lang=LOCALE[lang];if(vo)u.voice=vo;
  u.rate=.82;u.pitch=vo&&/natural|online/i.test(vo.name)?.9:.7;u.volume=1;   // slow, grave, unhurried
  u.onstart=()=>{setSubtitle(s);setState('speaking')};
  if(i===parts.length-1)u.onend=()=>{setState('idle');ambStop()};
  speechSynthesis.speak(u)});
}
function stopSpeak(){try{speechSynthesis.cancel()}catch{}vtoken++;try{curSrc&&curSrc.stop()}catch{}stopAllSrcs();ambStop();setState('idle')}
const setSpeakBtn=()=>$('#voiceOut').textContent='🔊 '+SL().speaks+': '+(speakOn?SL().on:SL().off);
$('#voiceOut').onclick=()=>{speakOn=!speakOn;store.set('speak',speakOn);setSpeakBtn();if(!speakOn)stopSpeak()};setSpeakBtn();

/* ---------- Verse cards / explorer ---------- */
function vcard(v){const i=id(v);return`<div class="vc" data-id="${i}"><button class="heart ${saved.has(i)?'on':''}" data-h="${i}" aria-label="save">${saved.has(i)?'♥':'♡'}</button><div class="t">BG ${i}</div><div class="s">${esc(clean(v).split('।')[0].replace(/^.*उवाच\s*/,'').slice(0,90))}…</div><div class="e">${esc(v.translation)}</div>${v.themes.slice(0,3).map(t=>`<span class="tag">${esc(themeName(t))}</span>`).join('')}</div>`}
function renderCards(el,list){el.innerHTML=list.length?list.map(vcard).join(''):'<div class="empty">'+tx('Nothing here yet.')+'</div>'}
document.addEventListener('click',e=>{
 const h=e.target.closest('.heart');if(h){e.stopPropagation();toggleSave(h.dataset.h);return}
 const c=e.target.closest('.vc');if(c)openVerse(c.dataset.id);
});
function toggleSave(i){saved.has(i)?saved.delete(i):saved.add(i);store.set('saved',[...saved]);toast(saved.has(i)?'Saved ♥':'Removed');refreshSaved()}
function refreshSaved(){$('#savedCount').textContent=saved.size;renderCards($('#savedGrid'),[...saved].map(i=>byId[i]).filter(Boolean));
 $$('.heart').forEach(b=>{const on=saved.has(b.dataset.h);b.classList.toggle('on',on);b.textContent=on?'♥':'♡'});
 if(!saved.size)$('#savedGrid').innerHTML='<div class="empty">'+tx('Tap ♡ on any verse to keep it here.')+'</div>'}
function openVerse(i,focusCard){
 const v=byId[i];if(!v)return;
 $('#box').innerHTML=`<button class="x" id="xBtn" aria-label="Close">×</button><span class="cite">${tx('Chapter')} ${v.chapter} · ${tx('Verse')} ${v.verse}</span>
 <div class="shloka">${esc(clean(v))}</div><div class="translit">${esc(v.transliteration)}</div>
 <p style="font:500 20px/1.6 'Newsreader','Tiro Devanagari Sanskrit','Noto Serif Telugu',serif">${esc(v.translation)}</p>${v.localized&&lang!=='en'?`<p class="wm">${tx('Translation prepared with AI from the Sanskrit. Please confirm with a teacher or a printed edition for study.')}</p>`:''}
 <details><summary class="pill" style="display:inline-block">${tx('Word by word')}</summary><p class="wm">${esc(v.word_meanings||'').replace(/;/g,' · ')}</p></details>
 <h3 style="margin-top:18px;font:700 24px 'Newsreader',serif;color:var(--gold)">${tx('Shloka card')}</h3>
 <div class="actions">${['Midnight','Saffron','Lotus'].map((n,k)=>`<button class="pill ${k===cardTheme?'on':''}" data-ct="${k}">${tx(n)}</button>`).join('')}</div>
 <canvas id="cv" class="cardprev" width="1080" height="1080"></canvas>
 <div class="actions"><button class="pill" id="vRecite" type="button">${tx('🕉 Recite shloka')}</button><button class="pill" id="vTeach" type="button">${tx('📖 Teach me this shloka')}</button></div>
 <div class="actions"><button class="go" id="dl">${tx('⬇ Download 1080×1080')}</button><button class="pill" id="sv">${tx(saved.has(i)?'♥ Saved':'♡ Save')}</button><button class="pill" id="cp">${tx('⧉ Copy verse')}</button><button class="pill" id="nx">${tx('Next verse ➜')}</button></div>`;
 $('#modal').classList.add('show');$('#xBtn').onclick=closeM;drawCard(v);$('#vRecite').onclick=()=>reciteShloka(v);$('#vTeach').onclick=()=>openTeach(i);
 $$('[data-ct]').forEach(b=>b.onclick=()=>{cardTheme=+b.dataset.ct;$$('[data-ct]').forEach(x=>x.classList.toggle('on',x===b));drawCard(v)});
 $('#dl').onclick=()=>{const a=document.createElement('a');a.download=`gitopadesh-${i}.png`;a.href=$('#cv').toDataURL('image/png');a.click()};
 $('#sv').onclick=()=>{toggleSave(i);$('#sv').textContent=tx(saved.has(i)?'♥ Saved':'♡ Save')};
 $('#cp').onclick=()=>navigator.clipboard?.writeText(`${v.sanskrit}\n\n${v.translation}\n\n— Bhagavad Gita ${i}`).then(()=>toast('Copied'));
 $('#nx').onclick=()=>{const k=VERSES.indexOf(v);openVerse(id(VERSES[(k+1)%VERSES.length]))};
 if(focusCard)setTimeout(()=>$('#cv').scrollIntoView({behavior:'smooth'}),150);
}
function closeM(){$('#modal').classList.remove('show')}
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeM()});
addEventListener('keydown',e=>{if(e.key==='Escape')closeM()});

/* ---------- Shloka card painter ---------- */
const CT=[{a:'#0a0820',b:'#2a1b6e',g:'#f5c76a',t:'#f3eee0'},{a:'#7a2e0a',b:'#f08a24',g:'#fff1c2',t:'#fffaf0'},{a:'#fdf0f3',b:'#f6c1d1',g:'#8a2a4d',t:'#3a1020'}];
function wrap(x,t,mw){const ws=t.split(/\s+/),ls=[];let l='';ws.forEach(w=>{const n=l?l+' '+w:w;if(x.measureText(n).width>mw&&l){ls.push(l);l=w}else l=n});if(l)ls.push(l);return ls}
async function drawCard(v){
 const c=$('#cv'),x=c.getContext('2d'),T=CT[cardTheme],W=1080;
 try{await Promise.all([document.fonts.load('400 40px "Tiro Devanagari Sanskrit"'),document.fonts.load('italic 500 30px "Newsreader"'),document.fonts.load('400 40px "Newsreader"')])}catch{}
 const g=x.createLinearGradient(0,0,W,W);g.addColorStop(0,T.a);g.addColorStop(1,T.b);x.fillStyle=g;x.fillRect(0,0,W,W);
 x.strokeStyle=T.g;x.globalAlpha=.16;x.lineWidth=2;for(let r=60;r<760;r+=48){x.beginPath();x.arc(W/2,W/2,r,0,7);x.stroke()}
 for(let k=0;k<16;k++){x.save();x.translate(W/2,W/2);x.rotate(k*Math.PI/8);x.beginPath();x.ellipse(0,-300,36,120,0,0,7);x.stroke();x.restore()}
 x.globalAlpha=1;x.strokeStyle=T.g;x.lineWidth=3;x.strokeRect(36,36,W-72,W-72);x.lineWidth=1;x.strokeRect(50,50,W-100,W-100);
 x.textAlign='center';x.fillStyle=T.g;x.font='400 76px "Tiro Devanagari Sanskrit","Noto Serif Telugu",serif';x.fillText('ॐ',W/2,170);
 x.font='400 40px "Tiro Devanagari Sanskrit","Noto Serif Telugu",serif';let y=250;
 wrap(x,clean(v),W-220).slice(0,6).forEach(l=>{x.fillText(l,W/2,y);y+=66});
 y+=14;x.fillRect(W/2-60,y,120,3);y+=62;
 x.fillStyle=T.t;let fs=36,tl;
 do{x.font=`italic 500 ${fs}px "Newsreader","Tiro Devanagari Sanskrit","Noto Serif Telugu",serif`;tl=wrap(x,v.translation.trim(),W-240);fs-=2}while(tl.length*(fs+22)>W-y-170&&fs>20);
 tl.forEach(l=>{x.fillText(l,W/2,y);y+=fs+22});
 x.fillStyle=T.g;x.font='700 34px "Newsreader","Tiro Devanagari Sanskrit","Noto Serif Telugu",serif';x.fillText(`Bhagavad Gita · Chapter ${v.chapter}, Verse ${v.verse}`,W/2,W-110);
 x.globalAlpha=.7;x.font='500 24px Inter,sans-serif';x.fillText('GITOPADESH',W/2,W-72);x.globalAlpha=1;
}

/* ---------- Page wiring ---------- */
const PROMPTS={en:['I failed my exam and feel ashamed','My boss takes credit for my work and I am furious','I lost someone I love and can’t move on','I can’t decide between two job offers','I’m anxious about my future'],hi:['मैं परीक्षा में असफल हो गया','मेरे बॉस मेरा श्रेय ले लेते हैं','मैं बहुत चिंतित हूँ'],te:['నేను పరీక్షలో ఫెయిల్ అయ్యాను','నాకు చాలా ఆందోళనగా ఉంది','నేను రెండు ఉద్యోగాల మధ్య తేల్చుకోలేకపోతున్నాను']};
function chips(){$('#chips').innerHTML=PROMPTS[lang].map(p=>`<button class="pill">${p}</button>`).join('')}
$('#chips').onclick=e=>{const b=e.target.closest('.pill');if(b)ask(b.textContent)};
$('#goBtn').onclick=()=>ask($('#q').value);
$('#q').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask($('#q').value)}});
const autosize=()=>{const q=$('#q');q.style.height='auto';q.style.height=Math.min(160,q.scrollHeight)+'px'};$('#q').addEventListener('input',autosize);
function setLang(l){lang=l;store.set('lang',l);$$('#langs .pill').forEach(x=>x.classList.toggle('on',x.dataset.l===l));chips();if(rec)rec.stop();if(i18nReady)applyLangAll()}
$('#langs').onclick=e=>{const b=e.target.closest('[data-l]');if(b)setLang(b.dataset.l)};setLang(lang);
fetch('/api/health').then(r=>r.json()).then(j=>{hasLLM=!!j.llm;ttsCfg=j.tts||false;sttCfg=!!j.stt}).catch(()=>{});


function today(){const v=VERSES[Math.floor(Math.random()*VERSES.length)];$('#todayBox').innerHTML=`<h2 style="margin:0">${tx('Verse of the moment')}</h2><span class="cite">${tx('Bhagavad Gītā')} ${id(v)}</span><div class="shloka">${esc(clean(v))}</div><p class="tr">${esc(v.translation)}</p><div class="row"><button class="pill" id="tNew" type="button">${tx('🪷 Another verse')}</button><button class="pill" id="tOpen" type="button">${tx('Open shloka card')}</button></div>`;
 $('#tNew').onclick=today;$('#tOpen').onclick=()=>openVerse(id(v))}
today();

let fCh=0,fTh='',fQ='',shown=12;
$('#chapters').innerHTML=`<button class="pill on" data-ch="0">All</button>`+Array.from({length:18},(_,i)=>`<button class="pill" data-ch="${i+1}">${i+1}</button>`).join('');
$('#themeChips').innerHTML=[...new Set(VERSES.flatMap(v=>v.themes))].filter(t=>t!=='general').sort().map(t=>`<button class="pill" data-th="${t}">${t}</button>`).join('');
$('#chapters').onclick=e=>{const b=e.target.closest('[data-ch]');if(!b)return;fCh=+b.dataset.ch;$$('#chapters .pill').forEach(x=>x.classList.toggle('on',x===b));shown=12;explore()};
$('#themeChips').onclick=e=>{const b=e.target.closest('[data-th]');if(!b)return;fTh=fTh===b.dataset.th?'':b.dataset.th;$$('#themeChips .pill').forEach(x=>x.classList.toggle('on',x.dataset.th===fTh));shown=12;explore()};
$('#search').oninput=e=>{fQ=e.target.value.trim().toLowerCase();shown=12;explore()};
$('#more').onclick=()=>{shown+=12;explore()};
function explore(){
 let l=VERSES.filter(v=>(!fCh||v.chapter===fCh)&&(!fTh||v.themes.includes(fTh)));
 if(fQ){l=/^\d+\.\d+$/.test(fQ)?l.filter(v=>id(v)===fQ):l.filter(v=>(v.translation+' '+(v.translation_en||'')+' '+v.transliteration+' '+v.themes.join(' ')+' '+v.themes.map(themeName).join(' ')).toLowerCase().includes(fQ))}
 renderCards($('#results'),l.slice(0,shown));
 $('#more').style.display=l.length>shown?'inline-block':'none';$('#more').textContent=`${tx('Show more')} (${l.length-shown})`;
}
explore();refreshSaved();
let tt;function toast(m){const t=$('#toast');t.textContent=tx(m);t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2200)}

/* ================= Presence: state, stage, subtitles ================= */
const setState=s=>{document.body.dataset.state=s};
const setStage=n=>{document.body.dataset.stage=n};
const subEl=$('#subtitle');let lastSub='';
function setSubtitle(t){if(!t||t===lastSub)return;lastSub=t;let q=subEl.querySelector('q');if(!q){q=document.createElement('q');subEl.replaceChildren(q)}q.textContent=t}
function lastSentence(t){const parts=String(t).replace(/\s+/g,' ').trim().split(/(?<=[.!?।॥])\s+/).filter(Boolean);let s=parts[parts.length-1]||'';
 if(s.length<28&&parts.length>1)s=parts[parts.length-2]+' '+s;
 if(s.length>190){s=s.slice(-190);s='…'+s.slice(s.indexOf(' ')+1)}return s}

/* ================= History (this browser only) ================= */
const HK='gp_hist_v1';let hist=store.get(HK,[]);
const updHist=()=>{$('#histCount').textContent=hist.length};
function saveExchange(e){hist.unshift(e);hist=hist.slice(0,60);store.set(HK,hist);updHist()}
function leafHTML(e){const L=T[e.lang]||T.en,order=ORDER[e.mode]||['SAY'];
 return `<div class="kr"><div class="who">${UVACHA()}</div>`+order.filter(k=>e.sec&&e.sec[k]).map(k=>{
  const v=k==='VERSE'&&e.vid&&byId[e.vid];
  const vb=v?`<span class="cite">${tx('Bhagavad Gītā')} ${e.vid}</span><div class="shloka">${esc(clean(v))}</div><div class="translit">${esc(v.transliteration)}</div>`:'';
  return `<div class="step ${k==='ASK'?'ask':''}"><b>${L.h[k]}</b>${vb}<p>${esc(e.sec[k])}</p></div>`}).join('')+`</div>`}
const modeLabel=m=>tx(m==='ASK'?'Krishna asked':m==='TEACH'?'Teaching':'Dialogue');
function openHistory(){
 const box=$('#box');
 box.innerHTML=`<button class="x" id="xBtn" aria-label="Close">×</button><h3>${tx('Your conversations')}</h3><p class="wm">${tx('Kept only in this browser. Nothing is stored on a server.')}</p>`+
  (hist.length?`<div class="hlist">${hist.map((e,i)=>`<button class="hitem" data-i="${i}" type="button"><span class="hd">${new Date(e.t).toLocaleString([],{dateStyle:'medium',timeStyle:'short'})} · ${modeLabel(e.mode)}${e.vid?' · BG '+e.vid:''}</span><span class="hq">${esc(e.q.slice(0,140))}</span></button>`).join('')}</div><div class="actions"><button class="pill" id="hClear" type="button">${tx('Clear all history')}</button></div>`
   :'<div class="empty">'+tx('No conversations yet. Speak to Krishna and they will appear here.')+'</div>');
 $('#modal').classList.add('show');$('#xBtn').onclick=closeM;
 $$('.hitem').forEach(b=>b.onclick=()=>openHistItem(+b.dataset.i));
 const c=$('#hClear');if(c)c.onclick=()=>{if(c.dataset.sure){hist=[];store.set(HK,hist);updHist();openHistory();toast('History cleared')}else{c.dataset.sure=1;c.textContent=tx('Tap again to confirm')}};
}
function openHistItem(i){const e=hist[i];if(!e)return;
 $('#box').innerHTML=`<button class="x" id="xBtn" aria-label="Close">×</button><button class="pill" id="hBack" type="button">${tx('← All conversations')}</button><div class="me"><small>${tx('You')}</small><span>${esc(e.q)}</span></div>${leafHTML(e)}<div class="actions">${e.vid?`<button class="pill" id="hCard" type="button">${tx('🖼 Shloka card')}</button>`:''}<button class="pill" id="hCopy" type="button">${tx('⧉ Copy')}</button><button class="pill" id="hDel" type="button">${tx('Delete')}</button></div>`;
 $('#xBtn').onclick=closeM;$('#hBack').onclick=openHistory;
 const h=$('#hCard');if(h)h.onclick=()=>openVerse(e.vid,true);
 $('#hCopy').onclick=()=>navigator.clipboard?.writeText(e.q+'\n\n'+Object.values(e.sec||{}).join('\n\n')).then(()=>toast('Copied'));
 $('#hDel').onclick=()=>{hist.splice(i,1);store.set(HK,hist);updHist();openHistory()};
}
$('#histBtn').onclick=openHistory;updHist();
T.en.greet='O seeker, you have come to the field. Speak: tell me what weighs upon your heart.';
T.hi.greet='हे साधक, तुम रणभूमि में आए हो। बोलो, तुम्हारे हृदय पर क्या बोझ है?';
T.te.greet='ఓ సాధకా, నీవు యుద్ధభూమికి వచ్చావు. చెప్పు, నీ హృదయంపై ఏ భారం ఉంది?';
$('#newConvo').onclick=()=>{history=[];ss.set('ctx',[]);$('#thread').innerHTML='';$('#chariot').classList.remove('show');setStage(1);lastSub='';setSubtitle(T[lang].greet);toast('A new conversation begins');window.scrollTo({top:0,behavior:'smooth'})};
$$('#langs [data-l]').forEach(b=>b.addEventListener('click',()=>{lastSub='';if(!history.length)setSubtitle(T[b.dataset.l].greet)}));

/* ================= Hero quote (real verses from the dataset) ================= */
let heroQuoteRefresh=()=>{};
(()=>{const IDS=['2.47','18.66','6.5','4.7','2.20','2.14'],box=$('#heroQuote');let k=0;
 const short=t=>{t=t.trim();if(t.length<=170)return t;const m=t.slice(0,170).match(/^.*[.;]/);return m?m[0]:t.slice(0,167)+'…'};
 function show(){const v=byId[IDS[k%IDS.length]];if(!v){k++;return}
  box.classList.add('out');setTimeout(()=>{box.innerHTML=`<p class="sk">${esc(clean(v).split(/[।॥]/)[0].trim()+' ॥')}</p><p class="en">“${esc(short(v.translation))}”</p><cite>${lang==='en'?'Krishna':lang==='hi'?'कृष्ण':'కృష్ణుడు'} · ${tx('Bhagavad Gītā')} ${id(v)}</cite>`;box.classList.remove('out');k++},k?500:0)}
 heroQuoteRefresh=()=>{k=Math.max(0,k-1);show()};show();setInterval(show,10000)})();

/* ================= Stage effects over the portrait ================= */
(()=>{
 const img=$('#heroPic'),cv=$('#fx'),ctx=cv.getContext('2d'),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const MOON={x:.54,y:.29,r:.195},IW=1280,IH=720;
 let W=0,H=0,dpr=1,pp=[.56,.25],P=[],F=[],rot=0,spd=.05,glow=.45,rip=[],rt=0,last=performance.now(),vis=true,slow=0,lowFx=false;
 if('IntersectionObserver'in window)new IntersectionObserver(([e])=>{vis=e.isIntersecting}).observe(cv);
 const place=()=>{pp=innerWidth<=900?[.55,.3]:[.56,.25];img.style.objectPosition=pp[0]*100+'% '+pp[1]*100+'%'};
 const map=(nx,ny)=>{const s=Math.max(W/IW,H/IH);return[(W-IW*s)*pp[0]+nx*IW*s,(H-IH*s)*pp[1]+ny*IH*s,s]};
 const rnd=(a,b)=>a+Math.random()*(b-a);
 const petal=top=>({x:rnd(0,W),y:top?rnd(-H,H):rnd(-60,-10),vx:rnd(6,22),vy:rnd(14,34),r:rnd(0,6.28),vr:rnd(-1.5,1.5),s:rnd(4,9),a:rnd(.45,.9),ph:rnd(0,6.28)});
 const fly=()=>({x:rnd(0,W),y:rnd(H*.3,H),vx:rnd(-6,6),vy:rnd(-12,-3),ph:rnd(0,6.28),s:rnd(1,2.4),c:Math.random()<.5?'255,214,120':'80,230,200'});
 function size(){const r=cv.getBoundingClientRect();W=r.width;H=r.height;if(!W||!H)return;dpr=MOBILE?1:Math.min(2,devicePixelRatio||1);cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);place();
  P=Array.from({length:MOBILE?7:Math.max(10,Math.round(W/42))},()=>petal(true));F=Array.from({length:MOBILE?5:Math.max(10,Math.round(W/34))},fly)}
 function chakra(cx,cy,r1,r2,a,al){
  ctx.save();ctx.translate(cx,cy);ctx.strokeStyle=`rgba(255,226,160,${al})`;ctx.fillStyle=`rgba(255,226,160,${al})`;
  ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(0,0,r1,0,7);ctx.stroke();ctx.beginPath();ctx.arc(0,0,r2,0,7);ctx.stroke();
  ctx.rotate(a);for(let i=0;i<18;i++){ctx.save();ctx.rotate(i*Math.PI/9);ctx.beginPath();ctx.moveTo(r1,0);ctx.lineTo(r2,0);ctx.stroke();ctx.beginPath();ctx.arc(r2+5,0,2.2,0,7);ctx.fill();ctx.restore()}
  ctx.rotate(-2*a);ctx.setLineDash([2,9]);ctx.beginPath();ctx.arc(0,0,r2+16,0,7);ctx.stroke();ctx.setLineDash([]);ctx.restore()}
 function frame(now){
  if(MOBILE&&now-last<45){requestAnimationFrame(frame);return}          // phones draw at about 22 fps; the voice gets the processor
  const dt=Math.min(.05,(now-last)/1000);last=now;if(!W){size();requestAnimationFrame(frame);return}
  if(!vis||document.hidden){requestAnimationFrame(frame);return}          // nothing to draw: costs almost nothing
  if(!lowFx){if(dt>.042)slow++;else slow=Math.max(0,slow-1);if(slow>90){lowFx=true;P.length=Math.ceil(P.length/3);F.length=Math.ceil(F.length/4)}}   // a slow phone gets a lighter scene
  const st=document.body.dataset.state||'idle';
  const tS={idle:.05,listening:.14,thinking:.9,speaking:.24}[st],tG={idle:.45,listening:.68,thinking:.85,speaking:1}[st];
  spd+=(tS-spd)*Math.min(1,dt*3);glow+=(tG-glow)*Math.min(1,dt*2.5);rot+=spd*dt;
  ctx.clearRect(0,0,W,H);
  const[mx,my,s]=map(MOON.x,MOON.y),R=MOON.r*IW*s,pulse=1+.07*Math.sin(now/(st==='speaking'?240:1500));
  const g=ctx.createRadialGradient(mx,my,R*.9,mx,my,R*2.3*pulse);g.addColorStop(0,`rgba(185,212,255,${.3*glow})`);g.addColorStop(1,'rgba(185,212,255,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(mx,my,R*2.4,0,7);ctx.fill();
  chakra(mx,my,R*1.17,R*1.5,rot,.12+.3*glow);
  if(st==='listening'||st==='speaking'){rt+=dt;if(rt>(st==='speaking'?.85:1.1)){rt=0;rip.push(0)}}
  rip=rip.map(a=>a+dt*.5).filter(a=>a<1);
  rip.forEach(a=>{ctx.strokeStyle=`rgba(244,239,225,${.4*(1-a)})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(mx,my,R*(1.05+a*1.25),0,7);ctx.stroke()});
  P.forEach((p,i)=>{p.ph+=dt;p.x+=(p.vx+Math.sin(p.ph*1.3)*14)*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;if(p.y>H+20||p.x>W+20)P[i]=petal(false);
   ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=`rgba(255,122,165,${p.a})`;ctx.beginPath();ctx.ellipse(0,0,p.s,p.s*.55*Math.abs(Math.cos(p.ph)*.6+.5),0,0,7);ctx.fill();ctx.restore()});
  F.forEach((f,i)=>{f.ph+=dt*2;f.x+=f.vx*dt;f.y+=f.vy*dt;if(f.y<-10||f.x<-10||f.x>W+10)F[i]=fly();
   const a=.25+.75*Math.abs(Math.sin(f.ph));const gg=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,f.s*5);gg.addColorStop(0,`rgba(${f.c},${a})`);gg.addColorStop(1,`rgba(${f.c},0)`);ctx.fillStyle=gg;ctx.beginPath();ctx.arc(f.x,f.y,f.s*5,0,7);ctx.fill()});
  if(!reduce)requestAnimationFrame(frame)};
 addEventListener('resize',()=>{size()});place();size();requestAnimationFrame(frame);
 if(img.complete)size();else img.addEventListener('load',size);
})();

/* ================= Floating mic + read-more ================= */
(()=>{const fab=$('#fab');
 if('IntersectionObserver'in window)new IntersectionObserver(([e])=>fab.classList.toggle('show',!e.isIntersecting),{threshold:.05}).observe($('#hero'));
 fab.onclick=()=>{$('#hero').scrollIntoView({behavior:'smooth'});setTimeout(()=>$('#q').focus({preventScroll:true}),500)};
 $('#readMore').onclick=()=>{const ks=$$('#thread .kr');(ks[ks.length-1]||$('#chariot')).scrollIntoView({behavior:'smooth',block:'start'})};
})();
setSubtitle(T[lang].greet);

/* ================= Krishna's voice: neural speech, temple-hall mastering, bansuri + tanpura ================= */
let warmN=null,bodyN=null,wetN=null,vstyle=store.get('vstyle','calm');
const STYLE_FX={calm:{warm:5,body:3,wet:.3,rate:1},natural:{warm:0,body:0,wet:.06,rate:1},deep:{warm:7,body:4.5,wet:.3,rate:.97},device:{warm:0,body:0,wet:.3,rate:1},chant:{warm:6,body:3,wet:.4,rate:1}};
let ttsCfg=false,AC=null,bus=null,verb=null,ambBus=null,vtoken=0,curSrc=null,ambOn=store.get('amb',!MOBILE),amb=null;
const liveSrcs=[];
/* Real flute recordings: any audio files placed in public/audio/flute are listed in tracks.json by the build.
   They play quietly under Krishna's voice and rotate; the synthesized flute below is only a fallback. */
const MUSIC_LEVEL=.075;        // music under the voice (the voice is at full level, so it stays clear)
const MUSIC_LEVEL_MOBILE=.06;
let mTracks=null,mLast=-1,music=null,musicBus=null;
async function musicList(){
 if(mTracks)return mTracks;
 try{const r=await fetch('/audio/flute/tracks.json');const j=r.ok?await r.json():{};mTracks=(j.tracks||[]).filter(t=>t&&t.file)}catch{mTracks=[]}
 const cr=mTracks.map(t=>t.credit).filter(Boolean);const el=document.getElementById('musicCredit');
 if(el&&cr.length){el.textContent='♪ '+[...new Set(cr)].join(' · ');el.hidden=false}
 return mTracks;
}
function musicStart(){
 if(!AC||!ambOn||music||!mTracks||!mTracks.length)return false;
 let k;do{k=Math.floor(Math.random()*mTracks.length)}while(mTracks.length>1&&k===mLast);mLast=k;
 const el=new Audio();el.preload='auto';el.src='/audio/flute/'+encodeURIComponent(mTracks[k].file);
 const g=AC.createGain();g.gain.value=0;
 try{AC.createMediaElementSource(el).connect(g);g.connect(musicBus)}catch{return false}
 const m={el,g};music=m;
 el.onended=()=>{if(music===m){music=null;musicStart()}};      // next track, chosen at random
 el.onerror=()=>{if(music===m){music=null}};
 el.play().then(()=>{g.gain.setTargetAtTime(MOBILE?MUSIC_LEVEL_MOBILE:MUSIC_LEVEL,AC.currentTime,1.2)}).catch(()=>{music=null});
 return true;
}
function musicStop(){
 if(!music)return;const m=music;music=null;
 try{m.g.gain.cancelScheduledValues(AC.currentTime);m.g.gain.setTargetAtTime(0,AC.currentTime,.5)}catch{}
 setTimeout(()=>{try{m.el.pause();m.el.src=''}catch{}},2600);
}
musicList();
function stopAllSrcs(){for(const s of liveSrcs.splice(0)){try{s.stop()}catch{}}}
let noiseBuf=null;
const noise=()=>noiseBuf||(noiseBuf=(()=>{const n=AC.sampleRate*2,b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;return b})());
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

function impulse(sec,decay){const n=Math.floor(AC.sampleRate*sec),b=AC.createBuffer(2,n,AC.sampleRate);
 for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,decay)}return b}

function applyStyleFX(st){const f=STYLE_FX[st||vstyle]||STYLE_FX.calm;if(!warmN)return;warmN.gain.value=f.warm;bodyN.gain.value=f.body;wetN.gain.value=f.wet}
let micHold=false;   // while the phone mic is listening the app's audio stays asleep: it fights the recogniser and causes beeps
function audioInit(){
 if(AC){if((AC.state==='suspended'||AC.state==='interrupted')&&!micHold)AC.resume();return}
 const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
 try{AC=new C({latencyHint:'playback'})}catch{AC=new C()}      // a larger buffer: no crackle on phones
 AC.onstatechange=()=>{if(AC&&!micHold&&(AC.state==='suspended'||AC.state==='interrupted')&&!document.hidden)AC.resume().catch(()=>{})};
 const warm=AC.createBiquadFilter();warm.type='lowshelf';warm.frequency.value=240;warm.gain.value=5;       // chest and warmth
 const body=AC.createBiquadFilter();body.type='peaking';body.frequency.value=150;body.gain.value=3;body.Q.value=.9;
 const air=AC.createBiquadFilter();air.type='highshelf';air.frequency.value=6500;air.gain.value=-4;          // soften the digital edge
 const comp=AC.createDynamicsCompressor();comp.threshold.value=-24;comp.ratio.value=3;
 if(!MOBILE){verb=AC.createConvolver();verb.buffer=impulse(2.6,2.4)}                                         // a stone temple hall (desktop only; phones skip the heavy reverb)
 const wet=AC.createGain();wet.gain.value=.3;warmN=warm;bodyN=body;wetN=wet;applyStyleFX();
 bus=AC.createGain();ambBus=AC.createGain();ambBus.gain.value=0;musicBus=AC.createGain();
 bus.connect(warm);warm.connect(body);body.connect(air);air.connect(comp);comp.connect(AC.destination);
 if(verb){air.connect(verb);ambBus.connect(verb);verb.connect(wet);wet.connect(comp)}
 ambBus.connect(comp);musicBus.connect(comp);   // music skips the voice EQ and reverb
}

/* bansuri flute (Bhoopali scale) over a tanpura drone, synthesized live */
function fluteNote(f,at,dur){
 const o=AC.createOscillator(),o2=AC.createOscillator(),vib=AC.createOscillator(),vg=AC.createGain(),g=AC.createGain(),g2=AC.createGain();
 o.type='sine';o2.type='sine';o.frequency.setValueAtTime(f*.985,at);o.frequency.exponentialRampToValueAtTime(f,at+.12);o2.frequency.value=f*2;
 vib.frequency.value=5.2;vg.gain.value=f*.006;vib.connect(vg);vg.connect(o.frequency);vg.connect(o2.frequency);
 g2.gain.value=.12;o2.connect(g2);g2.connect(g);o.connect(g);
 g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(.5,at+.14);g.gain.setValueAtTime(.5,at+dur*.7);g.gain.linearRampToValueAtTime(0,at+dur);
 const ns=AC.createBufferSource();ns.buffer=noise();ns.loop=true;const bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=f*2.5;bp.Q.value=2;
 const ng=AC.createGain();ng.gain.setValueAtTime(0,at);ng.gain.linearRampToValueAtTime(.05,at+.1);ng.gain.linearRampToValueAtTime(0,at+dur);
 ns.connect(bp);bp.connect(ng);ng.connect(g);g.connect(ambBus);
 [o,o2,vib].forEach(x=>{x.start(at);x.stop(at+dur+.1)});ns.start(at,Math.random()*1.5);ns.stop(at+dur+.05);
}
function ambStart(){
 if(!AC||!ambOn)return;
 if(mTracks&&mTracks.length){musicStart();return}      // real recordings available: no synthesized flute
 if(amb)return;const t=AC.currentTime,nodes=[];
 [[130.81,.55],[196,.4],[261.63,.35],[65.41,.45]].slice(0,MOBILE?2:4).forEach(([f,a],i)=>{
  const o=AC.createOscillator(),g=AC.createGain(),l=AC.createOscillator(),lg=AC.createGain();
  o.type='triangle';o.frequency.value=f;g.gain.value=a*.5;l.frequency.value=.12+i*.05;lg.gain.value=a*.25;
  l.connect(lg);lg.connect(g.gain);o.connect(g);g.connect(ambBus);o.start(t);l.start(t);nodes.push(o,l)});
 ambBus.gain.cancelScheduledValues(t);ambBus.gain.setTargetAtTime(MOBILE?.025:.04,t,1.6);
 const scale=[523.25,587.33,659.25,783.99,880,1046.5];let idx=2;
 const phrase=()=>{if(!amb)return;let at=AC.currentTime+.2;const n=3+Math.floor(Math.random()*3);
  for(let i=0;i<n;i++){idx=Math.max(0,Math.min(scale.length-1,idx+Math.floor(Math.random()*5)-2));const d=.9+Math.random()*1.3;fluteNote(scale[idx],at,d);at+=d*.95}};
 amb={nodes,timer:setInterval(phrase,5200)};phrase();
}
function ambStop(){
 musicStop();
 if(!amb)return;const a=amb;amb=null;clearInterval(a.timer);
 if(AC){ambBus.gain.cancelScheduledValues(AC.currentTime);ambBus.gain.setTargetAtTime(0,AC.currentTime,.7)}
 setTimeout(()=>a.nodes.forEach(n=>{try{n.stop()}catch{}}),3200);
}

const setFluteBtn=()=>$('#fluteBtn').textContent='🪈 '+SL().flute+': '+(ambOn?SL().on:SL().off);
$('#fluteBtn').onclick=()=>{ambOn=!ambOn;store.set('amb',ambOn);setFluteBtn();if(!ambOn)ambStop();else if(AC&&document.body.dataset.state==='speaking')ambStart()};setFluteBtn();

document.addEventListener('visibilitychange',()=>{if(!document.hidden&&AC&&(AC.state==='suspended'||AC.state==='interrupted'))AC.resume().catch(()=>{})});
/* ---- speech: starts on the FIRST finished sentence while the rest is still being written.
        Audio is scheduled on the audio clock, so playback stays gapless even when the phone's main thread is busy. ---- */
const TERM=/(?<=[.!?।॥])\s+/;
function sentencesOf(t){return String(t).replace(/[#*_]/g,'').split(/(?<=[.!?।॥])\s+|[\r\n]+/).map(s=>s.trim()).filter(Boolean)}
function speechParts(text){
 const raw=String(text).replace(/[#*_]/g,'').split(/(?<=[.!?।॥])\s+|\n+/).map(s=>s.trim()).filter(Boolean),out=[];
 for(const s of raw){if(out.length&&out[out.length-1].length<26)out[out.length-1]+=' '+s;else out.push(s)}
 return out.flatMap(s=>s.length<=500?[s]:s.match(/.{1,480}(?:\s|$)/g).map(x=>x.trim()));
}
let ttsFails=0,ttsCool=0;   // after 3 failures in a row the device voice is used for 5 minutes
function startSpeaker(langOv,styleOv){
 const L=langOv||lang,S=styleOv||vstyle;
 audioInit();stopSpeak();ambStart();applyStyleFX(S);
 const my=++vtoken,items=[],count={};
 let pro=!!(AC&&ttsCfg&&ttsCfg[L])&&S!=='device'&&Date.now()>=ttsCool,ended=false,running=false,cancelled=false,nextAt=0;
 const rate=(STYLE_FX[S]||STYLE_FX.calm).rate;
 const once=s=>{const ac=new AbortController(),t=setTimeout(()=>ac.abort(),12000);
  return fetch('/api/speak',{signal:ac.signal,method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:sanskritSpeech(s),lang:L,style:S==='device'?'calm':S})})
   .then(r=>r.ok?r.arrayBuffer():Promise.reject(new Error('tts '+r.status))).then(b=>AC.decodeAudioData(b)).finally(()=>clearTimeout(t))};
 const load=s=>once(s).catch(()=>sleep(400).then(()=>once(s))).then(b=>{ttsFails=0;return b},()=>{if(++ttsFails>=3)ttsCool=Date.now()+300000;return null});
 const finish=()=>{if(my===vtoken){setState('idle');ambStop();if(convo&&speakOn)setTimeout(()=>{if(!busy&&!rec&&my===vtoken&&document.body.dataset.state==='idle')startListening()},700)}};
 // browser voice path (also the graceful fallback)
 const vo=pickVoice(L);
 const browserSay=t=>new Promise(done=>{if(!('speechSynthesis'in window))return done();const u=new SpeechSynthesisUtterance(sanskritSpeech(t));u.lang=LOCALE[L];if(vo)u.voice=vo;
  u.rate=.82;u.pitch=vo&&/natural|online/i.test(vo.name)?.9:.7;
  u.onstart=()=>{if(my===vtoken){setSubtitle(t);setState('speaking')}};
  u.onend=()=>{done();if(!pro&&ended&&my===vtoken&&!speechSynthesis.pending)setTimeout(()=>{if(!speechSynthesis.speaking)finish()},200)};
  u.onerror=()=>done();setTimeout(done,Math.max(4000,t.length*130));   // never hang the queue
  speechSynthesis.speak(u)});
 const idleWait=()=>sleep(Math.max(0,(nextAt-(AC?AC.currentTime:0))*1000)+60);   // let already-scheduled audio finish
 function schedule(it,buf){
  const now=AC.currentTime,at=Math.max(nextAt,now+.05);
  const src=AC.createBufferSource();src.buffer=buf;src.playbackRate.value=rate;src.connect(bus);
  liveSrcs.push(src);src.onended=()=>{const k=liveSrcs.indexOf(src);if(k>=0)liveSrcs.splice(k,1)};
  src.start(at);nextAt=at+buf.duration/rate+.18;      // a natural breath between lines, set on the audio clock
  setTimeout(()=>{if(my===vtoken&&!cancelled){setSubtitle(it.t);setState('speaking')}},Math.max(0,(at-now)*1000));
 }
 async function loop(){
  if(running)return;running=true;let i=0;
  while(true){
   if(my!==vtoken||cancelled)return;
   if(i>=items.length){if(ended){await idleWait();finish();return}await sleep(60);continue}
   const it=items[i++],buf=await it.p;
   if(my!==vtoken||cancelled)return;
   if(!buf){   // this chunk only: wait for audio already queued, speak it with the device voice, then resume the deep voice
    await idleWait();if(my!==vtoken||cancelled)return;
    setSubtitle(it.t);setState('speaking');await browserSay(it.t);if(my!==vtoken||cancelled)return;nextAt=AC.currentTime;continue}
   schedule(it,buf);
  }
 }
 // fewer, larger requests: the first sentence goes out at once for a fast start, the rest travel in groups
 let acc='',first=true,accT=null;
 const flush=()=>{clearTimeout(accT);if(!acc)return;const t=acc;acc='';items.push({t,p:load(t)});loop()};
 const push=t=>{
  if(!pro){browserSay(t);return}
  if(first){first=false;items.push({t,p:load(t)});loop();return}
  if(acc&&(acc+' '+t).length>460)flush();
  acc=acc?acc+' '+t:t;
  if(acc.length>=130)flush();else{clearTimeout(accT);accT=setTimeout(flush,1100)}
 };
 return {
  feed(p,final){
   const order=ORDER[p.mode]||[];
   order.forEach((k,idx)=>{const sec=p.sec[k];if(sec===undefined)return;
    const complete=final||order.slice(idx+1).some(n=>p.sec[n]!==undefined);
    const ss=sentencesOf(sec),lim=complete?ss.length:ss.length-1,from=count[k]||0;
    for(let j=from;j<lim;j++)push(ss[j]);
    if(lim>from)count[k]=lim});
  },
  say(list){list.forEach(push)},
  end(){flush();ended=true;if(!pro&&!items.length&&!(window.speechSynthesis&&(speechSynthesis.speaking||speechSynthesis.pending)))finish();if(pro&&!items.length)finish();else if(pro)loop()},
  cancel(){cancelled=true;clearTimeout(accT);stopSpeak()}
 };
}
function speak(text){const sp=startSpeaker();sp.say(speechParts(text));sp.end()}   // used by the Listen button

/* ================= Voice in: hear everything, in any language, hands-free ================= */
const RE_DEV=/[ऀ-ॿ]/g,RE_TEL=/[ఀ-౿]/g;
function detectLang(t){const n=String(t).replace(/\s/g,'').length||1,d=(String(t).match(RE_DEV)||[]).length/n,e=(String(t).match(RE_TEL)||[]).length/n;return d>.3?'hi':e>.3?'te':null}
let convo=store.get('convo',false),sendTimer=null,silenceTimer=null,sttCfg=false,convoMiss=0,micWanted=false,emptyRuns=0;   // micWanted: the visitor has the mic open and decides when to stop
function stopMic(){micWanted=false;if(rec){try{rec.stop()}catch{}}else endListenUI()}
const setConvoBtn=()=>$('#convoBtn').textContent='🎧 '+SL().convo+': '+(convo?SL().on:SL().off);
$('#convoBtn').onclick=()=>{convo=!convo;convoMiss=0;store.set('convo',convo);setConvoBtn();
 toast(convo?'Hands-free on: Krishna will listen again after he speaks':'Hands-free off');
 if(convo&&!busy&&!rec&&document.body.dataset.state==='idle')startListening()};setConvoBtn();

function scheduleSend(){clearTimeout(sendTimer);toast('Sending to Krishna… tap the box to edit');
 sendTimer=setTimeout(()=>{const t=$('#q').value.trim();if(t)ask(t)},1500)}
['input','focus'].forEach(ev=>$('#q').addEventListener(ev,()=>clearTimeout(sendTimer)));

function endListenUI(){micHold=false;$('#mic').classList.remove('rec');if(!busy&&document.body.dataset.state==='listening')setState('idle')}
const MIC_MSG={'not-allowed':'Allow the microphone so Krishna can hear you.','service-not-allowed':'Allow the microphone so Krishna can hear you.','no-speech':'I heard nothing. Tap the mic and speak again.','network':'The speech service is unreachable. Please type instead.','audio-capture':'No microphone was found.'};

function startListening(){
 stopSpeak();if(MOBILE){micHold=true;if(AC&&AC.state==='running')AC.suspend().catch(()=>{})}else audioInit();clearTimeout(sendTimer);micWanted=true;emptyRuns=0;
 if(SR)return listenSR();
 if(sttCfg)return listenRec();
 toast('Voice input needs Chrome, Edge or Safari. You can still type.');
}

/* Browser speech recognition: live words, stops by itself after a pause */
/* Phones re-send finished words (sometimes cumulatively, sometimes twice). Keep each result once, by its index,
   drop a part that a later part simply extends or repeats, and collapse any phrase said back-to-back twice. */
function assembleTranscript(fin,interim){
 const norm=s=>s.trim().replace(/\s+/g,' ');
 let parts=fin.filter(Boolean).map(norm).filter(Boolean);
 if(interim&&norm(interim))parts.push(norm(interim));
 parts=parts.filter((p,i)=>{const n=parts[i+1];if(!n)return true;const a=p.toLowerCase(),b=n.toLowerCase();return !(b===a||b.startsWith(a)||b.startsWith(a.replace(/[.,!?।]+$/,'')))});
 const w=parts.join(' ').split(' ').filter(Boolean);
 for(let n=Math.min(40,w.length>>1);n>=3;n--)for(let i=0;i+2*n<=w.length;i++){
  let same=true;for(let k=0;k<n;k++)if(w[i+k].toLowerCase()!==w[i+n+k].toLowerCase()){same=false;break}
  if(same){w.splice(i+n,n);i--}}
 return w.join(' ');
}
function listenSR(){
 const r=new SR();r.lang=LOCALE[lang];r.interimResults=true;r.continuous=!MOBILE;r.maxAlternatives=1;   // phones listen one phrase at a time: no repeated text
 let final='',got=false,errored=false;const base=$('#q').value.trim()?$('#q').value.trim()+' ':'';
 const fin=[];let interim='';
 r.onresult=e=>{interim='';for(let i=e.resultIndex;i<e.results.length;i++){const res=e.results[i],tr=res[0].transcript;if(res.isFinal)fin[i]=tr;else interim=tr}
  const t=assembleTranscript(fin,interim);got=!!t.trim();final=t;$('#q').value=base+t;autosize()};
 r.onerror=e=>{if(e.error==='no-speech'||e.error==='aborted')return;errored=true;micWanted=false;if(MIC_MSG[e.error])toast(MIC_MSG[e.error])};
 r.onend=()=>{rec=null;
  if(MOBILE&&!errored&&!(convo&&final.trim())){   // phones beep every time listening restarts, so listen once per tap and keep the words
   micWanted=false;endListenUI();
   toast(got?'Got it. Tap the mic to add more, or press Ask Krishna.':MIC_MSG['no-speech']);return}
  if(micWanted&&!errored){
   emptyRuns=got?0:emptyRuns+1;
   if(convo&&final.trim()){micWanted=false;endListenUI();convoMiss=0;scheduleSend();return}      // hands-free mode answers after a pause
   if(emptyRuns>=3){micWanted=false;endListenUI();toast('Tap the mic when you want to continue.');return}
   setTimeout(()=>{if(micWanted&&!rec)listenSR()},200);return}                                     // otherwise keep listening: your words stay in the box
  endListenUI();
  if(convo&&final.trim()&&!errored){convoMiss=0;scheduleSend()}};
 rec=r;$('#mic').classList.add('rec');setState('listening');
 try{r.start()}catch{rec=null;endListenUI();return}
 toast(MOBILE?'Listening… speak now.':'Listening… take your time. I keep listening through your pauses. Tap the mic when you are done, then press Ask Krishna.');
 setTimeout(()=>{if(rec===r&&!got)r.stop()},MOBILE?12000:9000);
}

/* Fallback for browsers without speech recognition: record, then Krishna's server transcribes (Azure) */
function wavBlob(chunks,inRate){
 let len=0;chunks.forEach(c=>len+=c.length);const all=new Float32Array(len);let o=0;chunks.forEach(c=>{all.set(c,o);o+=c.length});
 const ratio=inRate/16000,n=Math.floor(len/ratio),pcm=new Int16Array(n);
 for(let i=0;i<n;i++){const v=Math.max(-1,Math.min(1,all[Math.floor(i*ratio)]));pcm[i]=v<0?v*0x8000:v*0x7FFF}
 const buf=new ArrayBuffer(44+pcm.length*2),dv=new DataView(buf),w=(p,s)=>[...s].forEach((c,i)=>dv.setUint8(p+i,c.charCodeAt(0)));
 w(0,'RIFF');dv.setUint32(4,36+pcm.length*2,true);w(8,'WAVEfmt ');dv.setUint32(16,16,true);dv.setUint16(20,1,true);dv.setUint16(22,1,true);
 dv.setUint32(24,16000,true);dv.setUint32(28,32000,true);dv.setUint16(32,2,true);dv.setUint16(34,16,true);w(36,'data');dv.setUint32(40,pcm.length*2,true);
 new Int16Array(buf,44).set(pcm);return new Blob([buf],{type:'audio/wav'});
}
async function listenRec(){
 let stream;try{stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}})}catch{toast(MIC_MSG['not-allowed']);return}
 const C=window.AudioContext||window.webkitAudioContext,ctx=new C(),src=ctx.createMediaStreamSource(stream),proc=ctx.createScriptProcessor(4096,1,1),chunks=[];
 let voiced=false,lastVoice=performance.now(),t0=lastVoice,done=false;
 const finish=async()=>{
  if(done)return;done=true;micWanted=false;rec=null;proc.disconnect();src.disconnect();stream.getTracks().forEach(t=>t.stop());endListenUI();
  if(!voiced){ctx.close();toast(MIC_MSG['no-speech']);return}
  setState('thinking');toast('Krishna is listening to what you said…');
  try{
   const blob=wavBlob(chunks,ctx.sampleRate);ctx.close();
   const r=await fetch('/api/transcribe?lang='+lang,{method:'POST',headers:{'Content-Type':'audio/wav'},body:blob});
   if(!r.ok)throw new Error('stt '+r.status);
   const j=await r.json();
   if(j.text){$('#q').value=($('#q').value.trim()+' '+j.text).trim();autosize();convoMiss=0;if(convo)scheduleSend()}else{toast(MIC_MSG['no-speech'])}
  }catch(e){toast('I could not hear that clearly. Please try again or type.')}
  if(!busy)setState('idle');
 };
 proc.onaudioprocess=e=>{const d=e.inputBuffer.getChannelData(0);chunks.push(new Float32Array(d));
  let s=0;for(let i=0;i<d.length;i+=8)s+=d[i]*d[i];const rms=Math.sqrt(s/(d.length/8)),now=performance.now();
  if(rms>.015){voiced=true;lastVoice=now}
  if((convo&&voiced&&now-lastVoice>1800)||now-t0>45000||(!voiced&&now-t0>9000))finish()};
 src.connect(proc);proc.connect(ctx.destination);   // the processor writes no output, so nothing is played back
 rec={stop:finish};$('#mic').classList.add('rec');setState('listening');toast('Listening… take your time. I keep listening through your pauses. Tap the mic when you are done, then press Ask Krishna.');
}

$('#mic').onclick=()=>{if(micWanted||rec){stopMic();return}startListening()};

/* ================= Voice style: Calm / Natural / Deep / Device ================= */
const VSTYLES=[['calm','Calm'],['natural','Natural'],['deep','Deep'],['device','Device']];
const SAMPLE={en:'O seeker, you have come to the field. Tell me what weighs upon your heart.',hi:'हे साधक, तुम रणभूमि में आए हो। बोलो, तुम्हारे हृदय पर क्या बोझ है?',te:'ఓ సాధకా, నీవు యుద్ధభూమికి వచ్చావు. చెప్పు, నీ హృదయంపై ఏ భారం ఉంది?'};
const setVstyleBtn=()=>$('#vstyleBtn').textContent='🎙 '+SL().voice+': '+SL().styles[vstyle];
$('#vstyleBtn').onclick=()=>{const i=VSTYLES.findIndex(v=>v[0]===vstyle);vstyle=VSTYLES[(i+1)%VSTYLES.length][0];store.set('vstyle',vstyle);setVstyleBtn();applyStyleFX();
 const sp=startSpeaker();sp.say([SAMPLE[lang]]);sp.end()};setVstyleBtn();

/* ================= Sanskrit pronunciation, shloka recitation, and "Teach me this shloka" ================= */
ORDER.LEARN=['BHAVAM','WORDS','MEANING','STORY','TODAY','REMEMBER'];
const LEARN_H={
 en:{BHAVAM:'The bhava, its inner feeling',WORDS:'Key words',MEANING:'The meaning',STORY:'From the Mahabharata',TODAY:'In your life today',REMEMBER:'Carry this with you'},
 hi:{BHAVAM:'भाव',WORDS:'मुख्य शब्द',MEANING:'अर्थ',STORY:'महाभारत से',TODAY:'आज के जीवन में',REMEMBER:'इसे याद रखो'},
 te:{BHAVAM:'భావం',WORDS:'ముఖ్య పదాలు',MEANING:'అర్థం',STORY:'మహాభారతం నుండి',TODAY:'నేటి జీవితంలో',REMEMBER:'దీన్ని గుర్తుంచుకో'}};

/* The voice reads plain spelling best. Map scholarly transliteration to how the word is actually said. */
const SK_MAP=[
 [/Bhagavad[\s-]*G[iī]t[aā]/gi,'Bhagavad Geeta'],[/G[iī]t[aā]/g,'Geeta'],[/K[ṛr][ṣs]ṇa/g,'Krishna'],[/Kuruk[ṣs]etra/g,'Kurukshetra'],
 [/P[āa]rtha/g,'Partha'],[/Bh[āa]rata/g,'Bharata'],[/P[āa][ñn]cajanya/g,'Panchajanya'],[/ni[ṣs]k[āa]ma/gi,'nishkama'],
 [/sthitapraj[ñn]a/gi,'sthita-pragya'],[/M[āa]dhava/g,'Madhava'],[/Dh[ṛr]tar[āa][ṣs][ṭt]ra/g,'Dhritarashtra'],[/Sa[ñn]jaya/g,'Sanjay'],
 [/Yudhi[ṣs][ṭt]hira/g,'Yudhishthira'],[/Bh[īi][ṣs]ma/g,'Bheeshma'],[/Dro[ṇn]a/g,'Drona'],[/Kar[ṇn]a/g,'Karna'],[/Draupad[īi]/g,'Draupadi'],
 [/Vy[āa]sa/g,'Vyasa'],[/Upani[ṣs]ad/gi,'Upanishad'],[/\bGovinda\b/g,'Govinda'],[/\bOm\b|\bAum\b/g,'Om']];
const SK_CH={'ā':'a','Ā':'A','ī':'ee','Ī':'Ee','ū':'oo','Ū':'Oo','ṛ':'ri','Ṛ':'Ri','ṝ':'ree','ṣ':'sh','Ṣ':'Sh','ś':'sh','Ś':'Sh','ṇ':'n','Ṇ':'N','ṭ':'t','Ṭ':'T','ḍ':'d','Ḍ':'D','ṅ':'ng','ñ':'ny','Ñ':'Ny','ṁ':'m','ṃ':'m','ḥ':'h','ḷ':'l'};
function sanskritSpeech(t){let s=String(t);for(const[re,r]of SK_MAP)s=s.replace(re,r);
 return s.replace(/jñ/g,'gy').replace(/[āĀīĪūŪṛṚṝṣṢśŚṇṆṭṬḍḌṅñÑṁṃḥḷ]/g,c=>SK_CH[c]||c)}

/* Chant the shloka itself: Devanagari read line by line by the Hindi voice, slowly, with the hall's resonance. */
function reciteShloka(v){
 const lines=clean(v).split(/[।॥|]+/).map(s=>s.trim()).filter(Boolean);if(!lines.length)return;
 const sp=startSpeaker(lang==='te'?'te':'hi','chant');sp.say(lines.map(l=>l+' ।'));sp.end();toast('Reciting the shloka… ॐ');
}

/* The lesson: bhava, key words, meaning, a Mahabharata episode, and today's life. Cached on this device. */
const TCK='gp_teach_v1:';
function openTeach(vid){
 const v=byId[vid];if(!v)return;stopSpeak();
 const key=TCK+vid+':'+lang,H=LEARN_H[lang]||LEARN_H.en;let sec=null;
 $('#box').innerHTML=`<button class="x" id="xBtn" aria-label="Close">×</button><span class="cite">${tx('Bhagavad Gītā')} ${vid}</span><div class="shloka">${esc(clean(v))}</div><div class="translit">${esc(v.transliteration)}</div>
 <div class="actions"><button class="pill" id="tRecite" type="button">${tx('🕉 Recite shloka')}</button><button class="pill" id="tListen" type="button">${tx('🔊 Listen to the lesson')}</button><button class="pill" id="tCard" type="button">${tx('🖼 Shloka card')}</button></div>
 <div class="kr" id="tBody"><div class="who">${UVACHA()}</div><div class="body"><div class="dots"><span></span><span></span><span></span></div></div></div>`;
 $('#modal').classList.add('show');
 $('#xBtn').onclick=()=>{stopSpeak();closeM()};
 $('#tRecite').onclick=()=>reciteShloka(v);$('#tCard').onclick=()=>openVerse(vid,true);
 $('#tListen').onclick=()=>{if(!sec||!Object.keys(sec).length){toast('The lesson is still being prepared');return}const sp=startSpeaker();sp.feed({mode:'LEARN',sec},true);sp.end()};
 const draw=final=>{const body=document.querySelector('#tBody .body');if(!body)return;
  body.innerHTML=ORDER.LEARN.filter(k=>sec&&sec[k]).map(k=>`<div class="step"><b>${H[k]}</b><p>${esc(sec[k])}</p></div>`).join('')||'<div class="dots"><span></span><span></span><span></span></div>';
  if(!final){const ps=body.querySelectorAll('p');if(ps.length)ps[ps.length-1].classList.add('caret')}};
 const cached=store.get(key,null);if(cached){sec=cached;draw(true);return}
 const offline=()=>{sec={BHAVAM:v.translation.trim(),WORDS:(v.word_meanings||'').split(';').slice(0,5).map(s=>s.trim().replace(/—/g,' - ')).filter(Boolean).join('\n'),MEANING:v.translation.trim()};draw(true)};
 if(!hasLLM){offline();return}
 (async()=>{
  const ac=new AbortController();let got=false;
  const tF=setTimeout(()=>{if(!got)ac.abort()},25000),tT=setTimeout(()=>ac.abort(),100000);
  try{
   const res=await fetch('/api/teach',{signal:ac.signal,method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:vid,lang})});
   if(!res.ok||!res.body)throw new Error('http '+res.status);
   const rd=res.body.getReader(),dec=new TextDecoder();let buf='';
   while(true){const{done,value}=await rd.read();if(done)break;got=true;buf+=dec.decode(value,{stream:true});
    if(buf.includes('\0ERR'))throw new Error('teach');sec=parseStream(buf).sec;draw(false)}
   sec=parseStream(buf).sec;if(!sec.MEANING)throw new Error('format');
   draw(true);store.set(key,sec);clearTimeout(tF);clearTimeout(tT);
  }catch(e){clearTimeout(tF);clearTimeout(tT);toast(e.name==='AbortError'?'The lesson is taking longer than usual. Showing the meaning.':/429/.test(e.message)?'Krishna rests a moment. Please try again in a minute.':'The full lesson is unavailable right now. Showing the meaning.');offline()}
 })();
}

/* ================= Shloka cards: any language, a short meaning, the site link at the bottom ================= */
const SITE_HOST='gitopadesh.jmadhan.me';
const CARD_T=[{a:'#0a0820',b:'#2a1b6e',g:'#f5c76a',t:'#f3eee0',m:'#b9bfe0'},{a:'#7a2e0a',b:'#f08a24',g:'#fff1c2',t:'#fffaf0',m:'#ffe3b8'},{a:'#fdf0f3',b:'#f6c1d1',g:'#8a2a4d',t:'#3a1020',m:'#7a4a5a'}];
const CARD_L={
 en:{meaning:'MEANING',ref:(c,v)=>`Bhagavad Gita · Chapter ${c}, Verse ${v}`,om:'ॐ',tag:'Ask Krishna · Bhagavad Gita guidance'},
 hi:{meaning:'अर्थ',ref:(c,v)=>`श्रीमद्भगवद्गीता · अध्याय ${c}, श्लोक ${v}`,om:'ॐ',tag:'कृष्ण से पूछिए · भगवद्गीता मार्गदर्शन'},
 te:{meaning:'అర్థం',ref:(c,v)=>`భగవద్గీత · అధ్యాయం ${c}, శ్లోకం ${v}`,om:'ఓం',tag:'కృష్ణుడిని అడగండి · భగవద్గీత మార్గదర్శనం'}};
const LANG_LABEL={en:'English',hi:'हिंदी',te:'తెలుగు'};
let cardLang=null;

function trFor(v,L){if(L==='en')return v.translation_en||v.translation;const e=VT[L]&&VT[L][id(v)];return (e&&e.t)||v.translation_en||v.translation}
function shlokaFor(v,L){const s=v.sanskrit.replace(/\s*[।॥]*\s*\d+\.\d+\s*[।॥]*\s*$/,'');return L==='te'?toTelugu(s):s}
function shortMeaning(t,max=190){
 t=String(t).replace(/\s+/g,' ').trim();if(t.length<=max)return t;
 let out='';for(const s of t.split(/(?<=[.!?।])\s+/)){const n=(out+' '+s).trim();if(n.length>max)break;out=n}
 if(out)return out;const c=t.slice(0,max);return c.replace(/[,;:\-—]?\s+\S*$/,'')+'…';
}
function rrect(x,X,y,w,h,r){x.beginPath();x.moveTo(X+r,y);x.arcTo(X+w,y,X+w,y+h,r);x.arcTo(X+w,y+h,X,y+h,r);x.arcTo(X,y+h,X,y,r);x.arcTo(X,y,X+w,y,r);x.closePath()}

async function paintCard(cv,v,L,themeIdx){
 if(!cv||!v)return;
 await loadVT(L);
 try{await Promise.all([document.fonts.load('400 40px "Tiro Devanagari Sanskrit"'),document.fonts.load('400 40px "Noto Serif Telugu"'),document.fonts.load('italic 500 30px "Newsreader"'),document.fonts.load('700 30px "Hanken Grotesk"'),document.fonts.load('400 30px "Yatra One"')])}catch{}
 const x=cv.getContext('2d'),T=CARD_T[themeIdx]||CARD_T[0],W=1080,Lb=CARD_L[L]||CARD_L.en;
 const g=x.createLinearGradient(0,0,W,W);g.addColorStop(0,T.a);g.addColorStop(1,T.b);x.fillStyle=g;x.fillRect(0,0,W,W);
 x.strokeStyle=T.g;x.globalAlpha=.14;x.lineWidth=2;for(let r=60;r<780;r+=48){x.beginPath();x.arc(W/2,W/2,r,0,7);x.stroke()}
 for(let k=0;k<16;k++){x.save();x.translate(W/2,W/2);x.rotate(k*Math.PI/8);x.beginPath();x.ellipse(0,-310,36,124,0,0,7);x.stroke();x.restore()}
 x.globalAlpha=1;x.strokeStyle=T.g;x.lineWidth=3;x.strokeRect(36,36,W-72,W-72);x.lineWidth=1;x.strokeRect(50,50,W-100,W-100);
 x.textAlign='center';x.textBaseline='alphabetic';
 // OM
 x.fillStyle=T.g;x.font='400 66px "Tiro Devanagari Sanskrit","Noto Serif Telugu",serif';x.fillText(Lb.om,W/2,150);
 // shloka: break at the danda, shrink to fit
 const sk=shlokaFor(v,L),parts=sk.split(/(?<=[।॥])\s*/).map(s=>s.trim()).filter(Boolean);
 let fs=46,lines,lh;
 for(;fs>=26;fs-=2){x.font=`400 ${fs}px "Tiro Devanagari Sanskrit","Noto Serif Telugu",serif`;lines=parts.flatMap(p=>wrap(x,p,W-220));lh=fs*1.62;if(lines.length*lh<=300)break}
 x.fillStyle=T.g;let y=232;lines.forEach(l=>{x.fillText(l,W/2,y);y+=lh});
 y+=6;x.globalAlpha=.8;x.fillRect(W/2-60,y,120,3);x.globalAlpha=1;
 // short meaning, in the card language
 y+=50;x.fillStyle=T.m;x.font=L==='en'?'600 22px "Hanken Grotesk",sans-serif':'500 28px "Tiro Devanagari Sanskrit","Noto Serif Telugu",serif';
 if('letterSpacing'in x)x.letterSpacing=L==='en'?'4px':'0px';x.fillText(Lb.meaning,W/2,y);if('letterSpacing'in x)x.letterSpacing='0px';
 y+=26;const limit=W-300,mean=shortMeaning(trFor(v,L));let mfs=38,ml;
 x.fillStyle=T.t;
 for(;mfs>=24;mfs-=2){x.font=`${L==='en'?'italic ':''}500 ${mfs}px "Newsreader","Tiro Devanagari Sanskrit","Noto Serif Telugu",serif`;ml=wrap(x,mean,W-220);if(y+ml.length*(mfs*1.5)<=limit)break}
 ml.forEach(l=>{y+=mfs*1.5;x.fillText(l,W/2,y)});
 // reference
 x.fillStyle=T.g;x.font='400 30px "Yatra One","Tiro Devanagari Sanskrit","Noto Serif Telugu",serif';x.fillText(Lb.ref(v.chapter,v.verse),W/2,W-218);
 // site link, on every card
 const pw=560,ph=70,px=(W-pw)/2,py=W-190;
 rrect(x,px,py,pw,ph,35);x.fillStyle='rgba(0,0,0,.22)';x.fill();x.strokeStyle=T.g;x.lineWidth=2;x.stroke();
 x.fillStyle=T.t;x.font='700 36px "Hanken Grotesk",sans-serif';x.fillText(SITE_HOST,W/2,py+47);
 x.fillStyle=T.m;x.font='500 22px "Hanken Grotesk","Tiro Devanagari Sanskrit","Noto Serif Telugu",sans-serif';x.fillText(Lb.tag,W/2,W-86);
}

/* the modal canvas */
async function drawCard(v){await paintCard($('#cv'),v,cardLang||lang,cardTheme)}
function cardDownload(cv,v,L,suffix){const a=document.createElement('a');a.download=`gitopadesh-${id(v)}-${L}${suffix||''}.png`;a.href=cv.toDataURL('image/png');a.click()}

const _openVerse=openVerse;
openVerse=function(i,focusCard){
 cardLang=openVerse.preset||lang;openVerse.preset=null;_openVerse(i,focusCard);
 const v=byId[i],cv=$('#cv');if(!v||!cv)return;
 const bar=document.createElement('div');bar.className='actions';bar.id='cardLangs';
 bar.innerHTML=Object.keys(LANG_LABEL).map(l=>`<button class="pill ${l===cardLang?'on':''}" type="button" data-cl="${l}">${LANG_LABEL[l]}</button>`).join('');
 cv.parentNode.insertBefore(bar,cv);
 const share=document.createElement('div');share.className='actions';share.id='shareBar';
 const dlRow=$('#dl')&&$('#dl').parentNode;if(dlRow)dlRow.after(share);
 mountShare(share,()=>v,()=>cardLang||lang,()=>$('#cv'));
 bar.onclick=e=>{const b=e.target.closest('[data-cl]');if(!b)return;cardLang=b.dataset.cl;$$('#cardLangs .pill').forEach(x=>x.classList.toggle('on',x===b));drawCard(v);share.render()};
 const dl=$('#dl');if(dl)dl.onclick=()=>cardDownload(cv,v,cardLang||lang);
};


/* ================= Share a shloka card: the picture itself on phones, links everywhere else ================= */
const SHARE_CAP={
 en:'A verse from the Bhagavad Gita for your heart today 🪷',
 hi:'आज आपके हृदय के लिए भगवद्गीता का एक श्लोक 🪷',
 te:'ఈ రోజు మీ హృదయం కోసం భగవద్గీత నుండి ఒక శ్లోకం 🪷'};
const verseUrl=v=>`https://${SITE_HOST}/verse/${v.chapter}-${v.verse}`;
function shareTargets(v,L){
 const url=verseUrl(v),text=SHARE_CAP[L]||SHARE_CAP.en,both=encodeURIComponent(text+'\n'+url),u=encodeURIComponent(url),t=encodeURIComponent(text);
 return [['WhatsApp','https://wa.me/?text='+both],['Telegram',`https://t.me/share/url?url=${u}&text=${t}`],['X',`https://twitter.com/intent/tweet?text=${t}&url=${u}`],['LinkedIn',`https://www.linkedin.com/sharing/share-offsite/?url=${u}`],['Facebook',`https://www.facebook.com/sharer/sharer.php?u=${u}`]];
}
async function shareNative(cv,v,L){
 const url=verseUrl(v),text=(SHARE_CAP[L]||SHARE_CAP.en)+'\n'+url;
 try{
  const blob=await new Promise(r=>cv.toBlob(r,'image/png'));
  const file=new File([blob],`gitopadesh-${id(v)}-${L}.png`,{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[file]}))await navigator.share({files:[file],text,title:'Gitopadesh'});
  else await navigator.share({text:SHARE_CAP[L]||SHARE_CAP.en,url,title:'Gitopadesh'});
 }catch(e){if(e&&e.name!=='AbortError'){window.open(shareTargets(v,L)[0][1],'_blank','noopener')}}
}
/* WhatsApp always carries the card picture:
   phones  -> the share sheet opens with the image already attached (tap WhatsApp);
   computers -> the image goes on the clipboard and WhatsApp opens with the caption (paste with Ctrl+V). */
async function shareWhatsApp(cv,v,L){
 const url=verseUrl(v),cap=SHARE_CAP[L]||SHARE_CAP.en,link=shareTargets(v,L)[0][1];
 let blob=null;try{blob=await new Promise(r=>cv.toBlob(r,'image/png'))}catch{}
 if(blob&&navigator.share&&navigator.canShare){
  try{const file=new File([blob],`gitopadesh-${id(v)}-${L}.png`,{type:'image/png'});
   if(navigator.canShare({files:[file]})){await navigator.share({files:[file],text:cap+'\n'+url,title:'Gitopadesh'});return}}
  catch(e){if(e&&e.name==='AbortError')return}
 }
 let copied=false;
 if(blob&&navigator.clipboard&&window.ClipboardItem){try{await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);copied=true}catch{}}
 if(!copied&&blob){const a=document.createElement('a');a.download=`gitopadesh-${id(v)}-${L}.png`;a.href=URL.createObjectURL(blob);a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)}
 window.open(link,'_blank','noopener');
 toast(copied?'Card copied. Paste it into the WhatsApp chat.':'Card saved. Attach it in WhatsApp.');
}
/* mounts a share row into `el`; call el.render() whenever the verse or language changes */
function mountShare(el,getV,getL,getCv){
 el.render=()=>{
  const v=getV(),L=getL();if(!v){el.innerHTML='';return}
  el.innerHTML=(navigator.share?`<button class="pill" type="button" data-sh="native">${esc(tx('📲 Share'))}</button>`:'')+
   shareTargets(v,L).map(([n,h])=>`<a class="pill"${n==='WhatsApp'?' data-sh="wa" title="Sends the card picture"':''} target="_blank" rel="noopener noreferrer" href="${h}">${n}</a>`).join('')+
   `<button class="pill" type="button" data-sh="copy">${esc(tx('Copy link'))}</button>`;
 };
 el.onclick=e=>{const b=e.target.closest('[data-sh]');if(!b)return;const v=getV(),L=getL();
  if(b.dataset.sh==='wa'){e.preventDefault();shareWhatsApp(getCv(),v,L)}
  else if(b.dataset.sh==='native')shareNative(getCv(),v,L);
  else navigator.clipboard?.writeText(verseUrl(v)).then(()=>toast('Link copied'),()=>toast(verseUrl(v)))};
 el.render();return el;
}

/* ================= Daily shloka ================= */
function dailyVerse(){
 const n=new Date(),day=Math.floor(Date.UTC(n.getFullYear(),n.getMonth(),n.getDate())/864e5);
 const pool=VERSES.filter(v=>(v.translation_en||v.translation).length<=240);
 return pool[(day*7919)%pool.length];
}
let dLang=null,dTheme=0;
async function renderDaily(){
 const cv=$('#dailyCv');if(!cv)return;
 const v=dailyVerse();dLang=dLang||lang;
 await paintCard(cv,v,dLang,dTheme);
 const n=new Date();
 $('#dailyCite').textContent=`${n.toLocaleDateString(dLang==='en'?'en-IN':dLang==='hi'?'hi-IN':'te-IN',{day:'numeric',month:'long',year:'numeric'})} · ${({en:'Bhagavad Gītā',hi:'भगवद्गीता',te:'భగవద్గీత'})[dLang]} ${id(v)}`;
 $('#dailyLangs').innerHTML=Object.keys(LANG_LABEL).map(l=>`<button class="pill ${l===dLang?'on':''}" type="button" data-dl="${l}">${LANG_LABEL[l]}</button>`).join('');
 $('#dailyDl').textContent=tx('⬇ Download card');$('#dailyOpen').textContent=tx('Open card');
 if(!$('#dailyShare').render)mountShare($('#dailyShare'),dailyVerse,()=>dLang||lang,()=>$('#dailyCv'));
 $('#dailyShare').render();
}
if($('#dailyCv')){
 $('#dailyLangs').onclick=e=>{const b=e.target.closest('[data-dl]');if(!b)return;dLang=b.dataset.dl;renderDaily()};
 $('#dailyDl').onclick=()=>cardDownload($('#dailyCv'),dailyVerse(),dLang||lang,'-daily');
 $('#dailyOpen').onclick=()=>{openVerse.preset=dLang||lang;openVerse(id(dailyVerse()),true)};
}

/* ================= Gentle reveal as sections scroll into view (never hides anything without JS) ================= */
(()=>{
 if(!('IntersectionObserver'in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.06,rootMargin:'0px 0px -4% 0px'});
 $$('main section.s, main .strip').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight*.92){el.classList.add('rv');io.observe(el)}});
})();

/* ================= Visitor counters (anonymous; hidden until the server reports them) ================= */
let visStats=null,visId=store.get('gp_vid',null),visFirst=false;
if(!visId||!/^[A-Za-z0-9_-]{16,32}$/.test(visId)){
 try{visId=Array.from(crypto.getRandomValues(new Uint8Array(18)),b=>'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[b%62]).join('')}
 catch{visId=(Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2)+'abcdefghijklmnop').slice(0,20)}
 store.set('gp_vid',visId);visFirst=true;
}
function renderStats(){
 const box=$('#stats');if(!box||!visStats)return;
 const nf=new Intl.NumberFormat(lang==='en'?'en-IN':lang==='hi'?'hi-IN':'te-IN');
 $('#stTotal').textContent=`👁 ${nf.format(visStats.total)} ${tx('visitors')}`;
 $('#stLive').innerHTML=`<i class="dotlive"></i>${nf.format(Math.max(1,visStats.live))} ${tx('online now')}`;
 box.hidden=false;const n=$('#stNote');n.hidden=false;n.textContent=tx('Counted with an anonymous random ID: no account or personal details.');
}
async function visPing(){
 if(document.hidden)return;
 try{
  const r=await fetch('/api/visit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:visId,first:visFirst})});
  if(!r.ok)return;
  const j=await r.json();
  if(j&&typeof j.total==='number'&&typeof j.live==='number'){visFirst=false;visStats=j;renderStats()}
 }catch{}
}
visPing();setInterval(visPing,60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)visPing()});

/* ================= Whole-site language: English / हिंदी / తెలుగు ================= */
const FAQ_I18N={
 hi:[
  ['गीतोपदेश क्या है?','गीतोपदेश एक निःशुल्क, वाणी-आधारित मार्गदर्शक है जहाँ आप कृष्ण को अपनी समस्या बताते हैं और भगवद्गीता से उत्तर पाते हैं। वे पहले सुनते हैं और एक प्रश्न पूछ सकते हैं, फिर एक श्लोक और व्यावहारिक मार्गदर्शन देते हैं, अंग्रेज़ी, हिंदी या तेलुगु में।'],
  ['क्या उत्तर देने वाले कृष्ण वास्तविक हैं?','उत्तर एक AI द्वारा बनाए जाते हैं जो कृष्ण की वाणी में बोलता है और भगवद्गीता पर आधारित है। दिखाए गए संस्कृत श्लोक, लिप्यंतरण और अर्थ गीता से ही हैं। यह एक चिंतनशील मार्गदर्शक है, किसी गुरु, चिकित्सक या मनोचिकित्सक का विकल्प नहीं।'],
  ['क्या गीतोपदेश निःशुल्क और निजी है?','हाँ, यह निःशुल्क है और साइन-अप नहीं चाहिए। आपकी बातचीत का इतिहास केवल आपके ब्राउज़र में रहता है और आप उसे कभी भी इतिहास से मिटा सकते हैं। उत्तर देने के लिए आपके शब्द Amazon Bedrock को भेजे जाते हैं, और कृष्ण के बोले हर वाक्य को Microsoft की वाक् सेवा को भेजा जाता है। गीतोपदेश स्वयं इन्हें संग्रहीत नहीं करता। आगंतुक-गणना केवल आपके ब्राउज़र में रखी गई एक गुमनाम यादृच्छिक ID का उपयोग करती है।'],
  ['कृष्ण मेरे लिए श्लोक कैसे चुनते हैं?','आपके शब्दों का अर्थ और विषय (जैसे भय, क्रोध, शोक, कर्तव्य और अशांत मन) के आधार पर भगवद्गीता के सभी 701 श्लोकों से मिलान किया जाता है। सबसे अच्छे मिलान कृष्ण को दिए जाते हैं, जो आपकी स्थिति के अनुकूल श्लोक चुनते हैं।'],
  ['फल की चिंता के बारे में भगवद्गीता क्या कहती है?','अध्याय 2, श्लोक 47 कहता है कि आपका अधिकार कर्म पर है, उसके फल पर नहीं। सामने के कार्य में पूरा प्रयास दीजिए और परिणाम की आसक्ति छोड़िए। यही निष्काम कर्म का सार है।'],
  ['क्रोध के बारे में भगवद्गीता क्या कहती है?','अध्याय 2, श्लोक 62 और 63 बताते हैं कि विषयों का चिंतन करने से आसक्ति, फिर कामना, क्रोध, मोह, स्मृति-भ्रंश और विवेक का नाश होता है। इसका उपाय मन की स्थिरता और इंद्रियों पर संयम है।'],
  ['क्या हिंदी और तेलुगु अनुवाद विश्वसनीय हैं?','संस्कृत श्लोक गीता से ही हैं। अंग्रेज़ी, हिंदी और तेलुगु अर्थ अनुवाद हैं। हिंदी और तेलुगु अनुवाद संस्कृत और मानक भाष्यों के आधार पर AI की सहायता से तैयार किए गए और संस्कृत से मिलान कर स्वचालित रूप से जाँचे गए हैं। गंभीर अध्ययन के लिए कृपया किसी गुरु या मुद्रित संस्करण से पुष्टि कीजिए।'],
  ['कौन-सी भाषाएँ और डिवाइस समर्थित हैं?','अंग्रेज़ी, हिंदी और तेलुगु; श्लोक संस्कृत में रहते हैं। वाणी इनपुट कंप्यूटर और Android पर Chrome या Edge में सबसे अच्छा चलता है, और साइट फ़ोन पर भी चलती है।']
 ],
 te:[
  ['గీతోపదేశ్ అంటే ఏమిటి?','గీతోపదేశ్ ఒక ఉచిత, స్వర-ఆధారిత మార్గదర్శి; ఇక్కడ మీరు కృష్ణుడికి మీ సమస్య చెప్పి భగవద్గీత నుండి సమాధానం పొందుతారు. ఆయన ముందు వింటాడు, ఒక ప్రశ్న అడగవచ్చు, ఆపై ఒక శ్లోకాన్ని, ఆచరణాత్మక మార్గదర్శనాన్ని ఇస్తాడు; ఆంగ్లం, హిందీ లేదా తెలుగులో.'],
  ['సమాధానం ఇచ్చే కృష్ణుడు నిజమేనా?','సమాధానాలను కృష్ణుడి స్వరంలో మాట్లాడే, భగవద్గీతపై ఆధారపడిన ఒక AI తయారుచేస్తుంది. చూపించే సంస్కృత శ్లోకాలు, లిప్యంతరీకరణలు, అర్థాలు గీత నుండే. ఇది ఆలోచనకు ఉపయోగపడే మార్గదర్శి మాత్రమే; గురువు, వైద్యుడు లేదా చికిత్సకుడికి ప్రత్యామ్నాయం కాదు.'],
  ['గీతోపదేశ్ ఉచితమేనా, గోప్యంగా ఉంటుందా?','అవును, ఇది ఉచితం, సైన్-అప్ అవసరం లేదు. మీ సంభాషణ చరిత్ర మీ బ్రౌజర్‌లో మాత్రమే ఉంటుంది; చరిత్ర విభాగం నుండి ఎప్పుడైనా తొలగించవచ్చు. సమాధానం ఇవ్వడానికి మీ మాటలు Amazon Bedrock కు, కృష్ణుడు మాట్లాడే ప్రతి వాక్యం Microsoft స్పీచ్ సేవకు పంపబడతాయి. గీతోపదేశ్ వాటిని నిల్వ చేయదు. సందర్శకుల లెక్కింపు మీ బ్రౌజర్‌లో ఉంచిన అజ్ఞాత యాదృచ్ఛిక ID మాత్రమే వాడుతుంది.'],
  ['నాకు శ్లోకాన్ని కృష్ణుడు ఎలా ఎంచుకుంటాడు?','మీ మాటల అర్థం, అంశం (భయం, కోపం, శోకం, కర్తవ్యం, చంచల మనస్సు వంటివి) ఆధారంగా భగవద్గీతలోని మొత్తం 701 శ్లోకాలతో పోల్చబడతాయి. ఉత్తమ సరిపోలికలు కృష్ణుడికి ఇవ్వబడతాయి; ఆయన మీ పరిస్థితికి సరిపోయేదాన్ని ఎంచుకుంటాడు.'],
  ['ఫలితం గురించిన ఆందోళనపై భగవద్గీత ఏం చెబుతుంది?','2వ అధ్యాయం, 47వ శ్లోకం: మీకు కర్మపైనే అధికారం ఉంది, దాని ఫలంపై కాదు. ఎదుట ఉన్న పనికి పూర్తి కృషి ఇవ్వండి, ఫలితంపై ఆసక్తిని వదలండి. ఇదే నిష్కామ కర్మ సారం.'],
  ['కోపం గురించి భగవద్గీత ఏం చెబుతుంది?','2వ అధ్యాయం, 62, 63 శ్లోకాలు: విషయాలను చింతించడం వల్ల ఆసక్తి, కోరిక, కోపం, మోహం, స్మృతి భ్రంశం, వివేక నాశనం కలుగుతాయి. మనస్సు స్థిరత్వం, ఇంద్రియ నిగ్రహం దీనికి పరిష్కారం.'],
  ['హిందీ, తెలుగు అనువాదాలు నమ్మదగినవేనా?','సంస్కృత శ్లోకాలు గీత నుండే. ఆంగ్లం, హిందీ, తెలుగు అర్థాలు అనువాదాలు. హిందీ, తెలుగు అనువాదాలు సంస్కృతం, ప్రామాణిక వ్యాఖ్యానాల ఆధారంగా AI సహాయంతో తయారై, సంస్కృతంతో స్వయంచాలకంగా సరిచూడబడ్డాయి. గంభీర అధ్యయనానికి దయచేసి గురువు లేదా ముద్రిత గ్రంథంతో నిర్ధారించుకోండి.'],
  ['ఏ భాషలు, పరికరాలకు మద్దతు ఉంది?','ఆంగ్లం, హిందీ, తెలుగు; శ్లోకాలు సంస్కృతంలోనే ఉంటాయి. స్వర ఇన్‌పుట్ కంప్యూటర్, Android లో Chrome లేదా Edge లో బాగా పనిచేస్తుంది; సైట్ ఫోన్‌లోనూ పనిచేస్తుంది.']
 ]};

/* ---- Devanagari to Telugu script (Sanskrit maps letter-for-letter) ---- */
function toTelugu(s){return String(s).replace(/ॐ/g,'ఓం').replace(/[ऀ-ॿ]/g,c=>{const n=c.charCodeAt(0);return (n===0x964||n===0x965||(n>=0x966&&n<=0x96F))?c:String.fromCharCode(n+0x300)})}

/* ---- verse text in the chosen language (translations prepared offline) ---- */
const VT={};let vtLoading={};
async function loadVT(l){
 if(l==='en'||VT[l])return;
 if(vtLoading[l])return vtLoading[l];
 vtLoading[l]=fetch('/verses.'+l+'.json').then(r=>r.ok?r.json():null).then(j=>{if(j)VT[l]=j}).catch(()=>{});
 await vtLoading[l];
}
function applyVerseLang(){
 const T2=VT[lang];
 VERSES.forEach(v=>{
  if(v.translation_en===undefined){v.translation_en=v.translation;v.word_meanings_en=v.word_meanings}
  const e=T2&&T2[id(v)];
  v.translation=(e&&e.t)||v.translation_en;
  v.word_meanings=(e&&e.w)||v.word_meanings_en;
  v.localized=!!(e&&e.t);
 });
}

/* ---- static page text ---- */
const ST=[ // [selector, english source]. Source text is captured once from the page.
 ['.hero-copy .eyebrow'],['.hero-copy .lead'],['#goBtn'],['.try'],['#newConvo'],['#readMore'],
 ['#journey li:nth-child(1)'],['#journey li:nth-child(2)'],['#journey li:nth-child(3)'],['#journey li:nth-child(4)'],
 ['#daily h2'],['#daily .lede'],['#explore h2'],['#explore .lede'],['#saved h2'],['#saved .lede'],['#how h2'],['#how .lede'],
 ['#how .bento>div:nth-child(1) h3'],['#how .bento>div:nth-child(1) p'],['#how .bento>div:nth-child(2) h3'],['#how .bento>div:nth-child(2) p'],
 ['#how .bento>div:nth-child(3) h3'],['#how .bento>div:nth-child(3) p'],['#how .bento>div:nth-child(4) h3'],['#how .bento>div:nth-child(4) p'],
 ['#faq h2'],['#faq .lede'],['#chapters-index h2'],['#chapters-index .lede'],['#about h2'],['#about p'],['#support h2'],['#support .sp'],['#support .mailtxt'],['#support .go'],['#ftDisc'],['noscript p']
];
function applyI18n(){
 document.documentElement.lang=lang;
 ST.forEach(([sel])=>{const el=document.querySelector(sel);if(!el)return;if(el.dataset.en===undefined)el.dataset.en=el.textContent.trim();el.textContent=tx(el.dataset.en)});
 const h1=$('.hero-copy h1');if(h1){if(h1.dataset.en===undefined)h1.dataset.en=h1.innerHTML;
  h1.innerHTML=lang==='hi'?'अपनी समस्या कहिए।<br><span>कृष्ण</span> आपका मार्ग दिखाएँगे।':lang==='te'?'మీ సమస్యను చెప్పండి.<br><span>కృష్ణుడు</span> మీకు దారి చూపిస్తాడు.':h1.dataset.en}
 // placeholders and labels
 const q=$('#q');if(q){if(q.dataset.en===undefined)q.dataset.en=q.placeholder;q.placeholder=tx(q.dataset.en)}
 const s=$('#search');if(s){if(s.dataset.en===undefined)s.dataset.en=s.placeholder;s.placeholder=tx(s.dataset.en)}
 // nav with counters
 $('#histBtn').innerHTML=`${tx('History')} <span id="histCount">${hist.length}</span>`;
 const lib=document.querySelector('.navr a[href="#explore"]');if(lib){if(lib.dataset.en===undefined)lib.dataset.en=lib.textContent.trim();lib.textContent=tx(lib.dataset.en)}
 const sup=document.querySelector('.navr a[href="/support"]');if(sup){if(sup.dataset.en===undefined)sup.dataset.en=sup.textContent.trim();sup.textContent=tx(sup.dataset.en)}
 const sv=document.querySelector('.navr a[href="#saved"]');if(sv)sv.innerHTML=`${tx('Saved')} <span id="savedCount">${saved.size}</span>`;
 // footer privacy line keeps its portfolio link
 const fp=document.querySelector('#ftPriv');
 if(fp){if(fp.dataset.en===undefined)fp.dataset.en='1';fp.innerHTML=esc(tx('Your words are sent to Amazon Bedrock to write Krishna’s reply, and each sentence he speaks is sent to Microsoft’s speech service. Gitopadesh does not store them; your conversation history stays only in your browser.'))+' · <a href="/support">'+esc(tx('Support'))+'</a> · <a href="mailto:hello@jmadhan.me">hello@jmadhan.me</a> · <a href="https://jmadhan.me" rel="noopener author" target="_blank">jmadhan.me</a>'}
 // about button text and link stay; FAQ
 const faq=$('#faq');if(faq){let box=faq.querySelector('.faq-box');
  if(!box){box=document.createElement('div');box.className='faq-box';faq.appendChild(box)}
  if(lang==='en'){faq.querySelectorAll(':scope > details').forEach(x=>x.hidden=false);box.innerHTML=''}
  else{faq.querySelectorAll(':scope > details').forEach(x=>x.hidden=true);box.innerHTML=FAQ_I18N[lang].map(([a,b])=>`<details><summary>${esc(a)}</summary><p>${esc(b)}</p></details>`).join('')}}
 // chapter links
 $$('.chlinks a').forEach((a,i)=>{if(a.dataset.en===undefined)a.dataset.en=a.innerHTML;
  a.innerHTML=lang==='en'?a.dataset.en:`${tx('Chapter')} ${i+1}: ${esc(CH_NAMES[lang][i])}<br><small style="opacity:.7">${(by_ch_count[i+1]||0)} ${tx('Verse')}</small>`});
 // theme chips, chapter 'All'
 buildThemeChips();
 const allb=document.querySelector('#chapters [data-ch="0"]');if(allb)allb.textContent=tx('All');
 document.title=lang==='hi'?'गीतोपदेश — कृष्ण से पूछिए, आपके जीवन के लिए भगवद्गीता मार्गदर्शन':lang==='te'?'గీతోపదేశ్ — కృష్ణుడిని అడగండి, మీ జీవితానికి భగవద్గీత మార్గదర్శనం':'Gitopadesh — Ask Krishna, Bhagavad Gita Guidance for Your Life';
 setSpeakBtn();setFluteBtn();setConvoBtn();setVstyleBtn();
 $('#more').textContent=tx('Show more');
}
const by_ch_count={};VERSES.forEach(v=>by_ch_count[v.chapter]=(by_ch_count[v.chapter]||0)+1);
function buildThemeChips(){
 const themes=[...new Set(VERSES.flatMap(v=>v.themes))].filter(t=>t!=='general').sort();
 $('#themeChips').innerHTML=themes.map(t=>`<button class="pill${fTh===t?' on':''}" data-th="${t}">${esc(themeName(t))}</button>`).join('');
}

/* ---- apply a language everywhere ---- */
async function applyLangAll(){
 await loadVT(lang);applyVerseLang();applyI18n();
 dLang=lang;renderDaily();renderStats();chips();today();shown=12;explore();refreshSaved();heroQuoteRefresh();
 if(!history.length){lastSub='';setSubtitle(T[lang].greet)}
 const note=$('#i18nNote');if(note)note.hidden=!(lang!=='en'&&VT[lang]);
}
i18nReady=true;applyLangAll();

})();