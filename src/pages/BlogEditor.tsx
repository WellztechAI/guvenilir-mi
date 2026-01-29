import { useState, useEffect } from "react";
import { Paper, SeoAssessor, ContentAssessor } from "yoastseo";
import Researcher from "yoastseo/build/languageProcessing/languages/tr/Researcher.js";

import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/blog/RichTextEditor";
import BlogSidebar from "@/components/blog/BlogSidebar";
import SeoAnalysisPanel from "@/components/blog/SeoAnalysisPanel";
import EditorHeader from "@/components/blog/EditorHeader";

const BlogEditor = () => {
  const [title, setTitle] = useState("");
  const [titleHeadingLevel, setTitleHeadingLevel] = useState<"h1" | "h2" | "h3">("h1");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [keyword, setKeyword] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [excerpt, setExcerpt] = useState("");
  
  // Sidebar state
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [visibility, setVisibility] = useState<"public" | "private" | "password">("public");
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState("");
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);

  // Analysis state
  const [seoScore, setSeoScore] = useState<number | null>(null);
  const [readabilityScore, setReadabilityScore] = useState<number | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);

  // Simulation loading states
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Auto-generate slug from title if empty
  useEffect(() => {
     if (!slug && title) {
         setSlug(title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""));
     }
  }, [title, slug]);

  useEffect(() => {
    const runAnalysis = async () => {
      if (!content && !title) return;

      try {
        const paper = new Paper(content, {
            keyword: keyword,
            title: title || "Başlık",
            description: metaDescription || "Meta açıklaması...",
            url: slug || "link",
            locale: "tr_TR",
        });

        const researcher = new Researcher(paper);
        const seoAssessor = new SeoAssessor(researcher);
        const contentAssessor = new ContentAssessor(researcher);
        
        seoAssessor.assess(paper);
        contentAssessor.assess(paper);

        const seoResults = seoAssessor.getValidResults();
        const contentResults = contentAssessor.getValidResults();
        
        const combinedResults = [
          ...seoResults.map((r: any) => ({ ...r, type: 'seo' })),
          ...contentResults.map((r: any) => ({ ...r, type: 'content' }))
        ];

        setAnalysisResults(combinedResults);
        setSeoScore(seoAssessor.calculateOverallScore());
        setReadabilityScore(contentAssessor.calculateOverallScore());

      } catch (e) {
        console.error("Yoast analysis failed", e);
      }
    };

    // Debounce analysis
    const timer = setTimeout(() => {
        runAnalysis();
    }, 500);

    return () => clearTimeout(timer);
  }, [content, keyword, title, slug, metaDescription]);

  const handleSaveDraft = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
        setIsSaving(false);
    }, 1000);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    // Simulate API call
    setTimeout(() => {
        setIsPublishing(false);
        setStatus("published");
    }, 1500);
  };

  const handleFeaturedImageUpload = () => {
      // Mock upload for now
      const url = "https://images.unsplash.com/photo-1499750310159-5254f3615481?q=80&w=2670&auto=format&fit=crop";
      setFeaturedImage(featuredImage ? null : url);
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-[#F0F0F1] min-h-screen max-w-7xl">
      <EditorHeader 
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isSaving={isSaving}
        isPublishing={isPublishing}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Editor Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-4">
             <div className="bg-white rounded-md shadow-sm border p-1 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50/50 border-b">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Başlık Tipi:</span>
                    {(["h1", "h2", "h3"] as const).map((level) => (
                        <button 
                            key={level}
                            type="button"
                            onClick={() => setTitleHeadingLevel(level)}
                            className={`px-3 py-1 text-xs font-bold rounded transition-all border ${
                                titleHeadingLevel === level 
                                ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                                : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300 hover:text-gray-600'
                            }`}
                        >
                            {level.toUpperCase()}
                        </button>
                    ))}
                </div>
                <Input
                    id="title"
                    placeholder="Yazı başlığını buraya ekleyin"
                    style={{ 
                        fontFamily: "'Inter', sans-serif",
                        fontSize: titleHeadingLevel === 'h1' ? '1.75rem' : titleHeadingLevel === 'h2' ? '1.5rem' : '1.25rem',
                        fontWeight: 600
                    }}
                    className="border-0 px-4 py-8 shadow-none bg-white h-auto placeholder:text-gray-200 focus-visible:ring-0 transition-all"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            
            <div className="bg-white rounded-md shadow-sm min-h-[500px]">
                 <RichTextEditor 
                    content={content} 
                    onChange={setContent} 
                    placeholder="Hikayenizi anlatmaya başlayın..."
                 />
            </div>
          </div>

          <SeoAnalysisPanel 
            seoScore={seoScore}
            readabilityScore={readabilityScore}
            analysisResults={analysisResults}
            keyword={keyword}
            setKeyword={setKeyword}
            title={title}
            slug={slug}
            metaDescription={metaDescription}
            setMetaDescription={setMetaDescription}
          />
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
           <BlogSidebar 
                status={status}
                visibility={visibility}
                seoScore={seoScore}
                readabilityScore={readabilityScore}
                categories={categories}
                selectedCategories={categories}
                onCategoryChange={() => {}} // Mock
                tags={tags}
                onTagsChange={setTags}
                featuredImage={featuredImage}
                onFeaturedImageUpload={handleFeaturedImageUpload}
                excerpt={excerpt}
                onExcerptChange={setExcerpt}
           />
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
