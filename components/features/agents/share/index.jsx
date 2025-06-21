"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Dialog from "@/components/layout/dialog/dialog";
import InputSelect from "@/components/layout/form-fields/input-select";
import FormInput from "@/components/layout/form-fields/form-input";
import { Switch } from "@/components/ui/switch";
import { Copy, Code } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

const ShareAgent = () => {
  // ===== PARAMS =====
  const { agent_id } = useParams();

  // ===== SHARE URL =====
  const shareUrl = `${window.location.origin}/agent/${agent_id}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ShareLink shareUrl={shareUrl} />
      <ShareEmbedLink shareUrl={shareUrl} />
    </div>
  );
};

const ShareLink = ({ shareUrl }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);

      toast.success("Link copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Your agent link</h2>

      <Card className="px-6 py-4 w-fit flex items-center gap-8 shadow-none">
        <span className="text-sm">{shareUrl}</span>

        <Button
          variant="secondary"
          size="icon"
          className="shrink-0 h-8 w-8"
          onClick={handleCopy}
        >
          <Copy />
        </Button>
      </Card>
    </div>
  );
};

const ShareEmbedLink = ({ shareUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [width, setWidth] = useState("100");
  const [widthUnit, setWidthUnit] = useState("%");
  const [height, setHeight] = useState("600");
  const [heightUnit, setHeightUnit] = useState("px");

  const generateIframeCode = () => {
    const widthValue = isFullscreen ? "100%" : `${width}${widthUnit}`;
    const heightValue = isFullscreen ? "100vh" : `${height}${heightUnit}`;
    const styleAttribute = `border: none; width: ${widthValue}; height: ${heightValue}`;

    return `<iframe
  src="${shareUrl}"
  style="${styleAttribute}"
></iframe>`;
  };

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(generateIframeCode());
      toast.success("Embed code copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy embed code");
    }
  };

  // ===== SELECT OPTIONS =====
  const widthUnitOptions = [
    { value: "%", label: "%" },
    { value: "px", label: "px" },
  ];

  const heightUnitOptions = [
    { value: "px", label: "px" },
    { value: "%", label: "%" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Embed agent</h2>

      {/* ===== IFRAME CARD ===== */}
      <Card
        className="p-8 cursor-pointer shadow-none aspect-square w-[200px] flex items-center justify-center"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
            <Code className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Iframe</h3>
          </div>
        </div>
      </Card>

      {/* ===== IFRAME MODAL ===== */}
      <Dialog
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        title="Iframe"
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="space-y-6">
          {/* ===== PUBLISH WARNING ===== */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">i</span>
            </div>
            <span className="text-blue-800">
              You need to publish your agent first.
            </span>
          </div>

          {/* ===== WINDOW SETTINGS ===== */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Window settings</h3>

            {/* ===== FULLSCREEN TOGGLE ===== */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Set to fullscreen</label>
              <Switch
                checked={isFullscreen}
                onCheckedChange={setIsFullscreen}
              />
            </div>

            {/* ===== WIDTH SETTING ===== */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Width</label>
              <div className="flex gap-2">
                <FormInput
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-20"
                  disabled={isFullscreen}
                />
                <InputSelect
                  options={widthUnitOptions}
                  value={widthUnit}
                  onChange={setWidthUnit}
                  disabled={isFullscreen}
                  className="w-16"
                />
              </div>
            </div>

            {/* ===== HEIGHT SETTING ===== */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Height</label>
              <div className="flex gap-2">
                <FormInput
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-20"
                  disabled={isFullscreen}
                />
                <InputSelect
                  options={heightUnitOptions}
                  value={heightUnit}
                  onChange={setHeightUnit}
                  disabled={isFullscreen}
                  className="w-16"
                />
              </div>
            </div>
          </div>

          {/* ===== EMBED CODE ===== */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                Paste this anywhere in your HTML code:
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyEmbed}
                className="h-8"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>

            <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">
                <code>
                  <span className="text-blue-600">&lt;iframe</span>
                  {"\n  "}
                  <span className="text-green-600">src</span>
                  <span className="text-gray-600">=</span>
                  <span className="text-red-600">"{shareUrl}"</span>
                  {"\n  "}
                  <span className="text-green-600">style</span>
                  <span className="text-gray-600">=</span>
                  <span className="text-red-600">
                    "border: none; width:{" "}
                    {isFullscreen ? "100%" : `${width}${widthUnit}`}; height:{" "}
                    {isFullscreen ? "100vh" : `${height}${heightUnit}`}"
                  </span>
                  {"\n"}
                  <span className="text-blue-600">&gt;&lt;/iframe&gt;</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ShareAgent;
