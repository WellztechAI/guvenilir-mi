import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface EditorHeaderProps {
  onSaveDraft: () => void;
  onPublish: () => void;
  isSaving: boolean;
  isPublishing: boolean;
}

const EditorHeader = ({ onSaveDraft, onPublish, isSaving, isPublishing }: EditorHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
            <h1 className="text-xl font-bold text-gray-800">Blog Editörü</h1>
            <p className="text-xs text-gray-500">İçeriğinizi oluşturun ve yönetin</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => window.open('#', '_blank')} className="hidden sm:flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden md:inline">Önizle</span>
        </Button>
        <Button variant="secondary" onClick={onSaveDraft} disabled={isSaving} className="flex items-center gap-2">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>Taslak Kaydet</span>
        </Button>
        <Button onClick={onPublish} disabled={isPublishing} className="bg-[#2271b1] hover:bg-[#135e96] flex items-center gap-2">
            {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            <span>Yayımla</span>
        </Button>
      </div>
    </div>
  );
};

export default EditorHeader;
