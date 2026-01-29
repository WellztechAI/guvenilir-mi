import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface SeoAnalysisProps {
    seoScore: number | null;
    readabilityScore: number | null;
    analysisResults: any[];
    keyword: string;
    setKeyword: (val: string) => void;
    title: string;
    slug: string;
    metaDescription: string;
    setMetaDescription: (val: string) => void;
}

const SeoAnalysisPanel = ({
    seoScore,
    readabilityScore,
    analysisResults,
    keyword,
    setKeyword,
    title,
    slug,
    metaDescription,
    setMetaDescription
}: SeoAnalysisProps) => {

    const seoProblems = analysisResults.filter(r => r.type === 'seo' && r.score < 5);
    const seoImprovements = analysisResults.filter(r => r.type === 'seo' && r.score >= 5 && r.score < 7);
    const seoGood = analysisResults.filter(r => r.type === 'seo' && r.score >= 7);

    const contentProblems = analysisResults.filter(r => r.type === 'content' && r.score < 5);
    const contentImprovements = analysisResults.filter(r => r.type === 'content' && r.score >= 5 && r.score < 7);
    const contentGood = analysisResults.filter(r => r.type === 'content' && r.score >= 7);

    return (
        <Card className="border shadow-sm">
            <CardHeader className="bg-white border-b px-4 py-3 flex flex-row items-center gap-2">
                <img src="https://yoast.com/app/uploads/2020/10/Yoast_SEO_Icon.svg" alt="Yoast" className="w-6 h-6" />
                <h3 className="font-bold text-gray-700">Yoast SEO Analizi</h3>
            </CardHeader>
            <CardContent className="p-0">
                <Tabs defaultValue="seo" className="w-full">
                    <TabsList className="w-full justify-start rounded-none border-b bg-gray-50 p-0 h-auto overflow-x-auto flex-nowrap">
                        <TabsTrigger value="seo" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#dc3232] data-[state=active]:bg-white px-4 py-3 gap-2 flex-shrink-0">
                            <span className={`w-3 h-3 rounded-full ${seoScore && seoScore >= 70 ? 'bg-green-500' : seoScore && seoScore >= 40 ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                            SEO
                        </TabsTrigger>
                        <TabsTrigger value="readability" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#dc3232] data-[state=active]:bg-white px-4 py-3 gap-2 flex-shrink-0">
                            <span className={`w-3 h-3 rounded-full ${readabilityScore && readabilityScore >= 70 ? 'bg-green-500' : readabilityScore && readabilityScore >= 40 ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                            Okunabilirlik
                        </TabsTrigger>
                        <TabsTrigger value="schema" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#dc3232] data-[state=active]:bg-white px-4 py-3 gap-2 flex-shrink-0">
                            <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                            Şema
                        </TabsTrigger>
                        <TabsTrigger value="social" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#dc3232] data-[state=active]:bg-white px-4 py-3 gap-2 flex-shrink-0">
                            <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                            Sosyal
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="seo" className="p-6 space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="keyword" className="font-bold text-gray-700">Odak anahtar kelime</Label>
                                <span className="text-gray-400 cursor-help" title="Yazınızın ne hakkında olduğunu en iyi açıklayan kelime veya kelime öbeği.">?</span>
                            </div>
                            <Input
                                id="keyword"
                                className="max-w-md"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Örn: Siyah Balık"
                            />
                        </div>

                        {/* Google Preview */}
                        <div className="border rounded-md p-4 bg-gray-50">
                            <h4 className="font-bold text-gray-700 mb-2">Google ön izleme</h4>
                            <div className="bg-white p-4 rounded border shadow-sm max-w-[600px]">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs">W</div>
                                    <div className="flex flex-col leading-tight">
                                        <span className="text-xs text-gray-800">example.com</span>
                                        <span className="text-xs text-gray-500">{slug ? `example.com > blog > ${slug}` : 'example.com > blog > ...'}</span>
                                    </div>
                                </div>
                                <h3 className="text-[#1a0dab] text-xl font-medium truncate cursor-pointer hover:underline mb-1">
                                    {title || "Yazı Başlığı"}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    <span className="text-gray-400">{new Date().toLocaleDateString('tr-TR', { month: 'short', day: 'numeric', year: 'numeric' })} — </span>
                                    {metaDescription || "Lütfen bir meta açıklama sağlayın. Aksi takdirde, Google arama sonuçlarında gösterilmek üzere yazınızın alakalı bir bölümünü bulmaya çalışır."}
                                </p>
                            </div>
                        </div>

                        {/* SEO Analysis */}
                        <Accordion type="single" collapsible defaultValue="analysis" className="w-full">
                            <AccordionItem value="analysis">
                                <AccordionTrigger className="text-lg font-bold">SEO Analizi</AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-4">
                                        {analysisResults.length === 0 && (
                                            <p className="text-gray-500 italic">Analiz için içerik ve odak anahtar kelime bekleniyor...</p>
                                        )}

                                        {seoProblems.length > 0 && (
                                            <div className="space-y-2">
                                                <h5 className="font-bold flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Sorunlar ({seoProblems.length})</h5>
                                                <ul className="list-none pl-5 space-y-2">
                                                    {seoProblems.map((r, i) => (
                                                        <li key={i} className="text-sm text-gray-700 relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-red-500" dangerouslySetInnerHTML={{ __html: r.text }} />
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {seoImprovements.length > 0 && (
                                            <div className="space-y-2">
                                                <h5 className="font-bold flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span> İyileştirilebilir ({seoImprovements.length})</h5>
                                                <ul className="list-none pl-5 space-y-2">
                                                    {seoImprovements.map((r, i) => (
                                                        <li key={i} className="text-sm text-gray-700 relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-orange-500" dangerouslySetInnerHTML={{ __html: r.text }} />
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {seoGood.length > 0 && (
                                            <div className="space-y-2">
                                                <h5 className="font-bold flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> İyi sonuçlar ({seoGood.length})</h5>
                                                <ul className="list-none pl-5 space-y-2">
                                                    {seoGood.map((r, i) => (
                                                        <li key={i} className="text-sm text-gray-700 relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-green-500" dangerouslySetInnerHTML={{ __html: r.text }} />
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <div className="space-y-2 border-t pt-4">
                            <div className="flex justify-between">
                                <Label htmlFor="description" className="font-bold text-gray-700">Meta açıklaması</Label>
                                <span className={`text-xs ${metaDescription.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>{metaDescription.length} karakter</span>
                            </div>
                            <Textarea
                                id="description"
                                className="h-24 resize-y font-sans"
                                value={metaDescription}
                                onChange={(e) => setMetaDescription(e.target.value)}
                                placeholder="Arama sonuçlarında görünecek kısa açıklama..."
                            />
                            <div className={`h-1.5 w-full bg-gray-200 rounded overflow-hidden`}>
                                <div
                                    style={{ width: `${Math.min((metaDescription.length / 160) * 100, 100)}%` }}
                                    className={`h-full transition-all duration-300 ${metaDescription.length > 0 && metaDescription.length < 120 ? 'bg-orange-500' : metaDescription.length >= 120 && metaDescription.length <= 160 ? 'bg-green-500' : 'bg-red-500'}`}
                                ></div>
                            </div>
                        </div>

                    </TabsContent>

                    <TabsContent value="readability" className="p-6">
                        <Accordion type="single" collapsible defaultValue="analysis" className="w-full">
                            <AccordionItem value="analysis">
                                <AccordionTrigger className="text-lg font-bold">Okunabilirlik Analizi</AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-4">
                                        {contentProblems.length > 0 && (
                                            <div className="space-y-2">
                                                <h5 className="font-bold flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Sorunlar ({contentProblems.length})</h5>
                                                <ul className="list-none pl-5 space-y-2">
                                                    {contentProblems.map((r, i) => (
                                                        <li key={i} className="text-sm text-gray-700 relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-red-500" dangerouslySetInnerHTML={{ __html: r.text }} />
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {contentImprovements.length > 0 && (
                                            <div className="space-y-2">
                                                <h5 className="font-bold flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span> İyileştirilebilir ({contentImprovements.length})</h5>
                                                <ul className="list-none pl-5 space-y-2">
                                                    {contentImprovements.map((r, i) => (
                                                        <li key={i} className="text-sm text-gray-700 relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-orange-500" dangerouslySetInnerHTML={{ __html: r.text }} />
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {contentGood.length > 0 && (
                                            <div className="space-y-2">
                                                <h5 className="font-bold flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> İyi sonuçlar ({contentGood.length})</h5>
                                                <ul className="list-none pl-5 space-y-2">
                                                    {contentGood.map((r, i) => (
                                                        <li key={i} className="text-sm text-gray-700 relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-green-500" dangerouslySetInnerHTML={{ __html: r.text }} />
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        {contentProblems.length === 0 && contentImprovements.length === 0 && contentGood.length === 0 && (
                                             <p className="text-gray-500 italic">Analiz için içerik bekleniyor...</p>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </TabsContent>

                    <TabsContent value="schema" className="p-6 text-gray-500 min-h-[200px] flex items-center justify-center">
                        <div className="text-center">
                             <Badge variant="outline" className="mb-2">Yakında</Badge>
                             <p>Şema ayarları yakında eklenecek.</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="social" className="p-6 text-gray-500 min-h-[200px] flex items-center justify-center">
                        <div className="text-center">
                             <Badge variant="outline" className="mb-2">Yakında</Badge>
                             <p>Sosyal medya ön izlemesi yakında eklenecek.</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default SeoAnalysisPanel;
