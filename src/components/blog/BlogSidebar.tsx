
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, User, Globe, Lock } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface BlogSidebarProps {
  status: "draft" | "published";
  visibility: "public" | "private" | "password";
  publishDate?: Date;
  seoScore: number | null;
  readabilityScore: number | null;
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string, isChecked: boolean) => void;
  tags: string;
  onTagsChange: (tags: string) => void;
  featuredImage: string | null;
  onFeaturedImageUpload: () => void; // Mock for now
  excerpt: string;
  onExcerptChange: (excerpt: string) => void;
}

const BlogSidebar = ({
    status,
    visibility,
    publishDate,
    seoScore,
    readabilityScore,
    // categories, // Use mock for now inside or pass from parent
    // selectedCategories,
    // onCategoryChange,
    tags,
    onTagsChange,
    featuredImage,
    onFeaturedImageUpload,
    excerpt,
    onExcerptChange
}: BlogSidebarProps) => {

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="py-3 bg-gray-50/50 border-b">
                    <CardTitle className="text-sm font-bold text-gray-700">Yayımla</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                             <div className={`w-2 h-2 rounded-full ${status === 'published' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                             <span>Durum:</span>
                        </div>
                        <span className="font-bold capitalize">{status === 'draft' ? 'Taslak' : 'Yayında'}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                         <div className="flex items-center gap-2 text-gray-600">
                             <Globe className="w-3 h-3" />
                             <span>Görünürlük:</span>
                        </div>
                         <span className="font-bold capitalize">
                            {visibility === 'public' ? 'Herkese Açık' : visibility === 'private' ? 'Özel' : 'Parolalı'}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                         <div className="flex items-center gap-2 text-gray-600">
                             <CalendarIcon className="w-3 h-3" />
                             <span>Tarih:</span>
                        </div>
                         <span className="font-bold">
                            {publishDate ? publishDate.toLocaleDateString() : 'Hemen'}
                        </span>
                    </div>
                    
                    <div className="border-t pt-3 mt-2 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">SEO Puanı:</span>
                            <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${seoScore && seoScore >= 70 ? 'bg-green-500' : seoScore && seoScore >= 40 ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                                <span className={`font-bold ${seoScore && seoScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                                    {seoScore ? (seoScore >= 70 ? "İyi" : seoScore >= 40 ? "Orta" : "Kötü") : "Yok"}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Okunabilirlik:</span>
                            <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${readabilityScore && readabilityScore >= 70 ? 'bg-green-500' : readabilityScore && readabilityScore >= 40 ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                                <span className={`font-bold ${readabilityScore && readabilityScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                                    {readabilityScore ? (readabilityScore >= 70 ? "İyi" : readabilityScore >= 40 ? "Orta" : "Kötü") : "Yok"}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <div className="p-3 bg-gray-50/50 border-t flex justify-between">
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 self-center">Çöpe At</Button>
                </div>
            </Card>

            <Card>
                <CardHeader className="py-3 bg-gray-50/50 border-b">
                    <CardTitle className="text-sm font-bold text-gray-700">Öne Çıkan Görsel</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    {featuredImage ? (
                        <div className="relative group">
                            <img src={featuredImage} alt="Featured" className="w-full h-32 object-cover rounded-md" />
                            <Button 
                                variant="destructive" 
                                size="sm" 
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={onFeaturedImageUpload /* Should be removal logic actually */}
                            >
                                Kaldır
                            </Button>
                        </div>
                    ) : (
                        <div 
                            className="border-2 border-dashed border-gray-200 rounded-md p-6 text-center hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={onFeaturedImageUpload}
                        >
                            <div className="text-gray-400 text-sm">Görsel seçmek için tıklayın</div>
                        </div>
                    )}
                </CardContent>
            </Card>

             <Card>
                <CardHeader className="py-3 bg-gray-50/50 border-b">
                    <CardTitle className="text-sm font-bold text-gray-700">Kategoriler</CardTitle>
                </CardHeader>
                <CardContent className="p-4 max-h-[200px] overflow-y-auto space-y-2">
                    {['Genel', 'Teknoloji', 'Yaşam', 'Sağlık', 'Yazılım', 'Haberler'].map((cat) => (
                        <div key={cat} className="flex items-center space-x-2">
                            <input type="checkbox" id={`cat-${cat}`} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <label htmlFor={`cat-${cat}`} className="text-sm text-gray-700">{cat}</label>
                        </div>
                    ))}
                    <div className="pt-2 border-t mt-2">
                        <Button variant="link" className="p-0 h-auto text-blue-600 text-xs">+ Yeni Kategori Ekle</Button>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="py-3 bg-gray-50/50 border-b">
                    <CardTitle className="text-sm font-bold text-gray-700">Etiketler</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                    <Label htmlFor="tags" className="sr-only">Etiketler</Label>
                    <Input 
                        id="tags" 
                        placeholder="Virgülle ayırarak ekleyin..." 
                        value={tags} 
                        onChange={(e) => onTagsChange(e.target.value)} 
                    />
                    <div className="text-xs text-gray-500">Örnek: seo, teknoloji, rehber</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="py-3 bg-gray-50/50 border-b">
                    <CardTitle className="text-sm font-bold text-gray-700">Özet</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <Textarea 
                         placeholder="Yazı özeti..."
                         className="min-h-[80px] text-sm resize-y"
                         value={excerpt}
                         onChange={(e) => onExcerptChange(e.target.value)}
                    />
                    <div className="text-xs text-gray-400 mt-1 text-right">{excerpt.length}/1000</div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BlogSidebar;
