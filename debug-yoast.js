import { Paper, SeoAssessor, ContentAssessor } from "yoastseo";
// We might need to handle the import path for Researcher depending on how it's resolved in Node vs Vite
// unique import path likely needs full path in node or might not work if it's ESM only and we run with CommonJS
// Let's try standard import first.
import Researcher from "yoastseo/build/languageProcessing/languages/tr/Researcher.js";

const run = () => {
    const content = "Bu bir deneme yazısıdır. SEO analizi yapmak istiyoruz ancak sonuçlar İngilizce çıkıyor.";
    const keyword = "SEO analizi";
    
    const paper = new Paper(content, {
        keyword: keyword,
        title: "SEO Analizi Testi",
        description: "Bu bir meta açıklamasıdır ve yeterli uzunlukta olmalıdır.",
        url: "seo-analizi-testi",
        locale: "tr_TR",
    });

    const researcher = new Researcher(paper);
    const seoAssessor = new SeoAssessor(researcher);
    const contentAssessor = new ContentAssessor(researcher);

    seoAssessor.assess(paper);
    contentAssessor.assess(paper);

    const seoResults = seoAssessor.getValidResults();
    const contentResults = contentAssessor.getValidResults();

    console.log("SEO Results Sample:", JSON.stringify(seoResults[0], null, 2));
    console.log("Content Results Sample:", JSON.stringify(contentResults[0], null, 2));
    
    // Check if we have identifiers
    console.log("All Identifiers:", [
        ...seoResults.map(r => r.identifier),
        ...contentResults.map(r => r.identifier)
    ]);
};

run();
