'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  ExternalLink,
  Trash2,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Cpu,
  BookOpen,
  Link2,
  CheckCircle2,
  Eye,
  Sliders,
  UploadCloud,
  Folder,
  Star,
  Loader2,
} from 'lucide-react';
import { Project, Skill, ProjectCategory, ArchitectureNode, Metric } from '@/types';

interface ProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  skillsList: Skill[];
  onClose: () => void;
  onSave: (data: Partial<Project>) => Promise<void>;
}

export function ProjectModal({
  isOpen,
  project,
  skillsList,
  onClose,
  onSave,
}: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'tech' | 'features' | 'architecture' | 'case_study' | 'seo'>('basic');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Full Stack');
  const [tier, setTier] = useState<'S' | 'A' | 'B' | 'C'>('A');
  const [type, setType] = useState('Web Application');
  const [vendorModel, setVendorModel] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [featured, setFeatured] = useState(false);
  const [year, setYear] = useState('2025');
  const [role, setRole] = useState('Lead Engineer');
  const [color, setColor] = useState('#00f0ff');
  const [isPrivate, setIsPrivate] = useState(false);

  // Media state
  const [image, setImage] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [mediaMessage, setMediaMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Tech state
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [customTechInput, setCustomTechInput] = useState('');

  // Features & Metrics
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [newMetricLabel, setNewMetricLabel] = useState('');
  const [newMetricValue, setNewMetricValue] = useState('');

  // Architecture Nodes
  const [architecture, setArchitecture] = useState<ArchitectureNode[]>([]);
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [newNodeType, setNewNodeType] = useState<'client' | 'server' | 'database' | 'service' | 'external'>('server');
  const [newNodeTech, setNewNodeTech] = useState('');
  const [newNodeDesc, setNewNodeDesc] = useState('');

  // Case Study Content
  const [csProblem, setCsProblem] = useState('');
  const [csSolutions, setCsSolutions] = useState('');
  const [csLessons, setCsLessons] = useState('');

  // Links & SEO
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [caseStudyUrl, setCaseStudyUrl] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [seoOgImage, setSeoOgImage] = useState('');

  // Populate when modal opens or project changes
  useEffect(() => {
    if (project) {
      setName(project.name || '');
      setSlug(project.slug || '');
      setTagline(project.tagline || '');
      setDescription(project.description || '');
      setCategory(project.category || 'Full Stack');
      setTier(project.tier || 'A');
      setType(project.type || 'Web Application');
      setVendorModel(project.vendorModel || '');
      setStatus(project.status || 'published');
      setFeatured(Boolean(project.featured));
      setYear(project.year || '2025');
      setRole(project.role || 'Lead Engineer');
      setColor(project.color || '#00f0ff');
      setIsPrivate(Boolean(project.isPrivate));

      setImage(project.image || '');
      setHeroImage(project.heroImage || '');
      setVideoUrl(project.videoUrl || '');
      setGallery(project.gallery || (project.image ? [project.image] : []));

      setSelectedTech(project.technologies || []);
      setFeatures(project.features || []);
      setMetrics(project.metrics || []);
      setArchitecture(project.architecture || []);

      setCsProblem(project.caseStudyContent?.problem || project.challenges?.[0]?.problem || '');
      setCsSolutions(project.caseStudyContent?.solutions || project.challenges?.[0]?.solution || '');
      setCsLessons(project.caseStudyContent?.lessonsLearned?.join('\n') || '');

      setLiveUrl(project.links?.live || '');
      setGithubUrl(project.links?.github || '');
      setCaseStudyUrl(project.links?.caseStudy || '');

      setSeoTitle(project.seo?.metaTitle || '');
      setSeoDesc(project.seo?.metaDescription || '');
      setSeoOgImage(project.seo?.ogImage || '');
    } else {
      // Reset for new project
      setName('');
      setSlug('');
      setTagline('');
      setDescription('');
      setCategory('Full Stack');
      setTier('A');
      setType('Web Application');
      setVendorModel('');
      setStatus('published');
      setFeatured(false);
      setYear(new Date().getFullYear().toString());
      setRole('Lead Engineer');
      setColor('#00f0ff');
      setIsPrivate(false);

      setImage('');
      setHeroImage('');
      setVideoUrl('');
      setGallery([]);

      setSelectedTech([]);
      setFeatures([]);
      setMetrics([]);
      setArchitecture([]);

      setCsProblem('');
      setCsSolutions('');
      setCsLessons('');

      setLiveUrl('');
      setGithubUrl('');
      setCaseStudyUrl('');
      setSeoTitle('');
      setSeoDesc('');
      setSeoOgImage('');
    }
    setError(null);
    setActiveTab('basic');
  }, [project, isOpen]);

  // Auto-generate slug when name changes (only for new projects)
  const handleNameChange = (val: string) => {
    setName(val);
    if (!project) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleToggleTech = (techName: string) => {
    if (selectedTech.includes(techName)) {
      setSelectedTech(selectedTech.filter((t) => t !== techName));
    } else {
      setSelectedTech([...selectedTech, techName]);
    }
  };

  const handleAddCustomTech = () => {
    if (customTechInput.trim() && !selectedTech.includes(customTechInput.trim())) {
      setSelectedTech([...selectedTech, customTechInput.trim()]);
      setCustomTechInput('');
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleAddMetric = () => {
    if (newMetricLabel.trim() && newMetricValue.trim()) {
      setMetrics([...metrics, { label: newMetricLabel.trim(), value: newMetricValue.trim() }]);
      setNewMetricLabel('');
      setNewMetricValue('');
    }
  };

  const handleRemoveMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const handleAddGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setGallery([...gallery, newGalleryUrl.trim()]);
      if (!image) {
        setImage(newGalleryUrl.trim());
      }
      setNewGalleryUrl('');
    }
  };

  const handleSetAsPrimary = (imgUrl: string) => {
    setImage(imgUrl);
    setMediaMessage({
      text: 'Selected as primary project thumbnail!',
      type: 'success',
    });
  };

  const handleMultiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setMediaMessage(null);
    const targetSlug = (slug || name || 'general').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}...`);

        const fd = new FormData();
        fd.append('file', file);
        fd.append('type', 'project');
        fd.append('projectSlug', targetSlug);

        const res = await fetch('/api/admin/cloudinary/upload', {
          method: 'POST',
          body: fd,
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || `Failed to upload ${file.name}`);
        }

        uploadedUrls.push(data.url);
      }

      const updatedGallery = [...gallery, ...uploadedUrls];
      setGallery(updatedGallery);

      // If no primary thumbnail set, make first uploaded file the primary image
      if (!image && uploadedUrls.length > 0) {
        setImage(uploadedUrls[0]);
      }

      setMediaMessage({
        text: `Successfully uploaded ${uploadedUrls.length} image(s) to Cloudinary folder "portfolio/projects/${targetSlug}"!`,
        type: 'success',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setMediaMessage({ text: msg, type: 'error' });
    } finally {
      setUploadingImages(false);
      setUploadProgress(null);
      e.target.value = '';
    }
  };

  const handleDeleteSingleImage = async (index: number) => {
    const targetUrl = gallery[index];
    if (!targetUrl) return;

    // Extract publicId if hosted on Cloudinary
    let publicId: string | null = null;
    if (targetUrl.includes('cloudinary.com')) {
      const match = targetUrl.match(/\/upload\/(?:v\d+\/)?([^.]+)/);
      if (match && match[1]) publicId = match[1];
    }

    const updatedGallery = gallery.filter((_, i) => i !== index);
    setGallery(updatedGallery);

    // If deleting the active thumbnail, fall back to next available or blank
    if (image === targetUrl) {
      setImage(updatedGallery[0] || '');
    }

    if (publicId) {
      try {
        await fetch('/api/admin/cloudinary/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId, resourceType: 'image' }),
        });
        setMediaMessage({
          text: 'Image deleted from Cloudinary storage and project gallery.',
          type: 'success',
        });
      } catch (err) {
        console.warn('Cloudinary delete warning:', err);
      }
    } else {
      setMediaMessage({
        text: 'Image removed from project gallery.',
        type: 'success',
      });
    }
  };

  const handleDeleteAllImages = async () => {
    if (gallery.length === 0) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete all ${gallery.length} images? This will permanently remove them from Cloudinary and this project.`
    );
    if (!confirmed) return;

    const publicIds: string[] = [];
    gallery.forEach((url) => {
      if (url.includes('cloudinary.com')) {
        const match = url.match(/\/upload\/(?:v\d+\/)?([^.]+)/);
        if (match && match[1]) publicIds.push(match[1]);
      }
    });

    const totalCount = gallery.length;
    setGallery([]);
    if (gallery.includes(image)) {
      setImage('');
    }

    if (publicIds.length > 0) {
      try {
        await fetch('/api/admin/cloudinary/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicIds, resourceType: 'image' }),
        });
        setMediaMessage({
          text: `Permanently deleted all ${totalCount} images from Cloudinary and project.`,
          type: 'success',
        });
      } catch (err) {
        console.warn('Cloudinary bulk delete error:', err);
      }
    } else {
      setMediaMessage({
        text: `Removed all ${totalCount} images from project gallery.`,
        type: 'success',
      });
    }
  };

  const handleAddNode = () => {
    if (newNodeLabel.trim() && newNodeTech.trim()) {
      const id = newNodeLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      setArchitecture([
        ...architecture,
        {
          id,
          label: newNodeLabel.trim(),
          type: newNodeType,
          technology: newNodeTech.trim(),
          description: newNodeDesc.trim(),
          x: 0,
          y: 0,
          connections: [],
        },
      ]);
      setNewNodeLabel('');
      setNewNodeTech('');
      setNewNodeDesc('');
    }
  };

  const handleRemoveNode = (index: number) => {
    setArchitecture(architecture.filter((_, i) => i !== index));
  };

  const handleSubmit = async (submitStatus: 'published' | 'draft') => {
    if (!name.trim()) {
      setError('Project Name is required.');
      setActiveTab('basic');
      return;
    }

    const finalSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!finalSlug) {
      setError('Slug could not be resolved.');
      setActiveTab('basic');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload: Partial<Project> = {
        name: name.trim(),
        slug: finalSlug,
        tagline: tagline.trim(),
        description: description.trim(),
        category,
        tier,
        type: type.trim(),
        vendorModel: vendorModel.trim() || undefined,
        status: submitStatus,
        featured,
        year,
        role: role.trim(),
        color,
        isPrivate,
        image: image.trim(),
        heroImage: heroImage.trim(),
        videoUrl: videoUrl.trim(),
        gallery,
        technologies: selectedTech,
        features,
        metrics,
        architecture,
        caseStudyContent: {
          overview: description.trim(),
          problem: csProblem.trim(),
          goals: features.slice(0, 3),
          solutions: csSolutions.trim(),
          lessonsLearned: csLessons.split('\n').map((l) => l.trim()).filter(Boolean),
        },
        links: {
          live: liveUrl.trim(),
          github: githubUrl.trim(),
          caseStudy: caseStudyUrl.trim(),
        },
        seo: {
          metaTitle: seoTitle.trim() || `${name} — ${tagline}`,
          metaDescription: seoDesc.trim() || description,
          ogImage: seoOgImage.trim() || image,
        },
      };

      await onSave(payload);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const MODAL_TABS = [
    { id: 'basic', label: '1. Basic Info', shortLabel: '1. Basic', icon: Sliders },
    { id: 'media', label: '2. Media & Visuals', shortLabel: '2. Media', icon: ImageIcon },
    { id: 'tech', label: '3. Technologies', shortLabel: '3. Tech', icon: Layers },
    { id: 'features', label: '4. Highlights & KPIs', shortLabel: '4. KPIs', icon: CheckCircle2 },
    { id: 'architecture', label: '5. Architecture Topology', shortLabel: '5. Arch', icon: Cpu },
    { id: 'case_study', label: '6. Case Study', shortLabel: '6. Case', icon: BookOpen },
    { id: 'seo', label: '7. Links & SEO', shortLabel: '7. SEO', icon: Link2 },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        data-lenis-prevent
        className="relative w-full max-w-5xl h-[95dvh] sm:h-auto sm:max-h-[90vh] bg-card border-t sm:border border-border rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-foreground overscroll-contain"
      >
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-surface/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-bold text-foreground truncate">
                {project ? `Edit: ${project.name}` : 'Add New Portfolio Project'}
              </h2>
              <p className="text-[11px] sm:text-xs font-mono text-muted-foreground truncate">
                {slug ? `slug: /work/${slug}` : 'Configure project metadata & architecture'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {slug && (
              <a
                href={`/work/${slug}?preview=true`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-muted border border-border text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                title="Preview draft or published project"
              >
                <Eye className="w-3.5 h-3.5 text-primary" />
                <span>Preview</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          data-lenis-prevent
          className="flex items-center gap-1 px-3 sm:px-6 py-2 border-b border-border bg-surface-elevated/30 overflow-x-auto text-xs font-mono overscroll-contain touch-pan-x shrink-0 mobile-scroll-x"
        >
          {MODAL_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg flex items-center gap-1.5 sm:gap-2 whitespace-nowrap transition-all shrink-0 cursor-pointer text-xs ${
                  activeTab === tab.id
                    ? 'bg-primary/20 text-primary font-bold border border-border-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Error notice */}
        {error && (
          <div className="mx-4 sm:mx-6 mt-3 sm:mt-4 p-3 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-mono shrink-0">
            {error}
          </div>
        )}

        <div
          data-lenis-prevent
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 overscroll-contain touch-pan-y"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground">Project Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Snapcart, Job Portal"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm font-sans focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground">URL Slug *</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. snapcart"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground">Tagline / Subtitle</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. High-throughput distributed event streaming platform"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive project narrative..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm leading-relaxed focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Backend">Backend</option>
                    <option value="AI">AI</option>
                    <option value="Realtime">Realtime</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Social">Social</option>
                    <option value="Automation">Automation</option>
                    <option value="Experimental">Experimental</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground">Tier</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as 'S' | 'A' | 'B' | 'C')}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                  >
                    <option value="S">Tier S (Flagship)</option>
                    <option value="A">Tier A (Major)</option>
                    <option value="B">Tier B (Standard)</option>
                    <option value="C">Tier C (Utility)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground">Year</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground">Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground">System / Architecture Type</label>
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="e.g. Multi-Vendor Marketplace (5 Portals)"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground">Vendor / Architecture Model</label>
                  <select
                    value={vendorModel}
                    onChange={(e) => setVendorModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                  >
                    <option value="">None / Custom</option>
                    <option value="Multi-Vendor Marketplace">Multi-Vendor Marketplace (Client + Seller + Admin)</option>
                    <option value="Single-Vendor Direct">Single-Vendor Direct (Client + Admin)</option>
                    <option value="Quick-Commerce Hub">Quick-Commerce Hub (Dark Store + Delivery)</option>
                    <option value="On-Demand Service">On-Demand Food / Service Portal</option>
                    <option value="Social Network">Social Network / Community</option>
                    <option value="SaaS Platform">SaaS Platform</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-elevated/40 border border-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span>Featured on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span>Private Codebase</span>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-xs font-mono text-muted-foreground">Accent Color:</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono">{color}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEDIA & VISUALS */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              {/* Dynamic Cloudinary Target Folder Notice */}
              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="text-xs font-mono text-foreground">
                    Target Cloudinary Folder:{' '}
                    <code className="px-2 py-0.5 rounded-md bg-black/40 text-purple-300 font-bold border border-purple-500/20">
                      portfolio/projects/{(slug || name || 'general').toLowerCase().replace(/[^a-z0-9_-]/g, '-')}
                    </code>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto text-[11px] font-mono text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Realtime Cloudinary Sync</span>
                </div>
              </div>

              {/* Status Banner Message */}
              {mediaMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-mono flex items-center justify-between border ${
                    mediaMessage.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-destructive/10 border-destructive/30 text-destructive'
                  }`}
                >
                  <span>{mediaMessage.text}</span>
                  <button
                    type="button"
                    onClick={() => setMediaMessage(null)}
                    className="text-xs hover:opacity-75 font-bold px-1"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Multi-Image Cloudinary Upload Dropzone */}
              <div className="relative border-2 border-dashed border-border hover:border-purple-500/60 rounded-2xl p-6 bg-surface/40 hover:bg-surface/60 transition-colors flex flex-col items-center justify-center text-center group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={uploadingImages}
                  onChange={handleMultiFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                />
                {uploadingImages ? (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    <span className="text-xs font-mono font-bold text-foreground">
                      {uploadProgress || 'Uploading images to Cloudinary...'}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Optimizing images and updating dynamic project folder
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2.5 py-2">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-mono font-bold text-foreground">
                        Click or drag &amp; drop multiple project screenshots
                      </span>
                      <p className="text-[11px] font-mono text-muted-foreground">
                        Files are directly uploaded to Cloudinary folder:{' '}
                        <span className="text-purple-400 font-semibold">
                          portfolio/projects/{(slug || name || 'general').toLowerCase().replace(/[^a-z0-9_-]/g, '-')}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Primary Thumbnail Preview & Field */}
              <div className="space-y-2 p-4 rounded-2xl bg-surface/40 border border-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Primary Project Card Thumbnail</span>
                  </label>
                  {image && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      Active Thumbnail
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://res.cloudinary.com/... or click 'Set as Primary' on any gallery image"
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                />
                {image && (
                  <div className="aspect-video max-w-xs rounded-xl overflow-hidden border border-border bg-black/40 relative group/thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/70 text-destructive opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                      title="Clear Primary Thumbnail"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Gallery Screenshots Showcase with Multi-image Slider Support */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-foreground font-bold uppercase tracking-wider">
                      Project Screenshots Gallery
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-mono font-bold">
                      {gallery.length} {gallery.length === 1 ? 'image' : 'images'}
                    </span>
                  </div>

                  {gallery.length > 0 && (
                    <button
                      type="button"
                      onClick={handleDeleteAllImages}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-mono font-medium transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete All ({gallery.length})</span>
                    </button>
                  )}
                </div>

                {/* Manual Add URL */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="Or paste external screenshot URL..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="px-4 py-2 rounded-xl bg-primary/20 text-primary border border-border-accent text-xs font-mono font-bold hover:bg-primary/30 transition-colors"
                  >
                    + Add URL
                  </button>
                </div>

                {/* Screenshots Grid */}
                {gallery.length === 0 ? (
                  <div className="p-6 rounded-2xl border border-dashed border-border bg-surface/20 text-center space-y-1">
                    <p className="text-xs font-mono text-muted-foreground">
                      No gallery images uploaded yet for this project.
                    </p>
                    <p className="text-[11px] font-mono text-muted-foreground/80">
                      Upload multiple images above to enable the interactive project card slider!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                    {gallery.map((imgUrl, idx) => {
                      const isPrimary = imgUrl === image;
                      return (
                        <div
                          key={idx}
                          className={`relative group rounded-xl overflow-hidden border aspect-video bg-black/40 transition-all ${
                            isPrimary
                              ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-lg shadow-amber-400/10'
                              : 'border-border hover:border-purple-500/50'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgUrl}
                            alt={`Project screenshot ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Primary Badge */}
                          {isPrimary && (
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500/90 text-black text-[10px] font-mono font-bold flex items-center gap-1 shadow-md">
                              <Star className="w-3 h-3 fill-black" />
                              <span>Primary</span>
                            </div>
                          )}

                          {/* Hover Actions Bar */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                            {!isPrimary && (
                              <button
                                type="button"
                                onClick={() => handleSetAsPrimary(imgUrl)}
                                className="px-2.5 py-1.5 rounded-lg bg-amber-500/90 hover:bg-amber-400 text-black text-[11px] font-mono font-bold flex items-center gap-1 transition-all shadow-md"
                              >
                                <Star className="w-3 h-3 fill-black" />
                                <span>Set Primary</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteSingleImage(idx)}
                              className="p-1.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-white text-xs font-mono font-bold transition-all shadow-md"
                              title="Delete screenshot from Cloudinary & Gallery"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Optional Hero Image and Video URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground">
                    Hero / Header Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground">
                    Video Demo / Stream URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or .mp4"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TECHNOLOGIES */}
          {activeTab === 'tech' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">
                  Select technologies from master skills catalog or add custom tags:
                </span>
                <span className="text-xs font-mono text-primary font-bold">
                  {selectedTech.length} selected
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customTechInput}
                  onChange={(e) => setCustomTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomTech();
                    }
                  }}
                  placeholder="Type custom technology and press Enter..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTech}
                  className="px-4 py-2 rounded-xl bg-primary/20 text-primary border border-border-accent text-xs font-mono font-bold hover:bg-primary/30 transition-colors"
                >
                  + Add Tag
                </button>
              </div>

              {/* Selected tech tags */}
              <div className="p-4 rounded-2xl bg-surface-elevated/40 border border-border space-y-2">
                <span className="text-[11px] font-mono text-muted-foreground uppercase block">
                  Active Stack on this Project:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTech.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/20 text-primary border border-primary/30 text-xs font-mono font-bold"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleTech(tech)}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {selectedTech.length === 0 && (
                    <span className="text-xs font-mono text-muted-foreground">No technologies selected yet.</span>
                  )}
                </div>
              </div>

              {/* Master Catalog Quick-Select */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-foreground font-bold uppercase">
                  Select from Skills Catalog:
                </span>
                <div
                  data-lenis-prevent
                  className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 rounded-xl bg-surface border border-border overscroll-contain touch-pan-y"
                  onWheel={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                >
                  {skillsList.map((skill) => {
                    const isSelected = selectedTech.includes(skill.name);
                    return (
                      <button
                        key={skill.name}
                        type="button"
                        onClick={() => handleToggleTech(skill.name)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                          isSelected
                            ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                            : 'bg-surface-elevated text-muted-foreground hover:text-foreground border border-border'
                        }`}
                      >
                        {skill.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FEATURES & METRICS */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              {/* Features manager */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-foreground font-bold uppercase">
                  Engineered Capabilities / Features ({features.length})
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="e.g. Distributed WebSocket state replication"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 rounded-xl bg-primary/20 text-primary border border-border-accent text-xs font-mono font-bold hover:bg-primary/30 transition-colors"
                  >
                    + Add Feature
                  </button>
                </div>

                <div className="space-y-1.5">
                  {features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-surface border border-border text-xs font-mono"
                    >
                      <span className="text-foreground">● {feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics manager */}
              <div className="space-y-3 pt-4 border-t border-border">
                <span className="text-xs font-mono text-foreground font-bold uppercase">
                  KPI Impact Metrics ({metrics.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newMetricValue}
                    onChange={(e) => setNewMetricValue(e.target.value)}
                    placeholder="Value (e.g. 99.9%, <50ms)"
                    className="px-3.5 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    value={newMetricLabel}
                    onChange={(e) => setNewMetricLabel(e.target.value)}
                    placeholder="Label (e.g. Uptime SLA, Latency)"
                    className="px-3.5 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddMetric}
                    className="px-4 py-2 rounded-xl bg-primary/20 text-primary border border-border-accent text-xs font-mono font-bold hover:bg-primary/30 transition-colors"
                  >
                    + Add KPI Metric
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="relative p-3 rounded-xl bg-surface border border-border text-center space-y-1 group"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveMetric(idx)}
                        className="absolute top-1.5 right-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <div className="text-lg font-bold font-mono text-primary">{m.value}</div>
                      <div className="text-[11px] font-mono text-muted-foreground">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ARCHITECTURE NODES */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <span className="text-xs font-mono text-foreground font-bold uppercase">
                Architecture Topology Nodes ({architecture.length})
              </span>
              <p className="text-xs text-muted-foreground">
                Defines service boundaries displayed on the interactive distributed system topology diagram.
              </p>

              <div className="p-4 rounded-2xl bg-surface-elevated/40 border border-border space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newNodeLabel}
                    onChange={(e) => setNewNodeLabel(e.target.value)}
                    placeholder="Component (e.g. API Gateway)"
                    className="px-3 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono"
                  />
                  <select
                    value={newNodeType}
                    onChange={(e) => setNewNodeType(e.target.value as typeof newNodeType)}
                    className="px-3 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono"
                  >
                    <option value="client">Client</option>
                    <option value="server">Server</option>
                    <option value="database">Database</option>
                    <option value="service">Service</option>
                    <option value="external">External</option>
                  </select>
                  <input
                    type="text"
                    value={newNodeTech}
                    onChange={(e) => setNewNodeTech(e.target.value)}
                    placeholder="Tech (e.g. FastAPI / Redis)"
                    className="px-3 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newNodeDesc}
                    onChange={(e) => setNewNodeDesc(e.target.value)}
                    placeholder="Brief description of service boundary..."
                    className="flex-1 px-3 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddNode}
                    className="px-4 py-2 rounded-xl bg-primary/20 text-primary border border-border-accent text-xs font-mono font-bold hover:bg-primary/30 transition-colors"
                  >
                    + Add Node
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {architecture.map((node, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-surface border border-border space-y-1.5 relative group"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveNode(idx)}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-primary font-bold">{node.label}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground uppercase">
                        {node.type}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-foreground">{node.technology}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{node.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CASE STUDY */}
          {activeTab === 'case_study' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground">Problem Statement &amp; Challenges</label>
                <textarea
                  rows={4}
                  value={csProblem}
                  onChange={(e) => setCsProblem(e.target.value)}
                  placeholder="Explain the specific engineering bottlenecks, constraints, and architecture challenges..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-xs leading-relaxed focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground">Architectural Solution &amp; Execution</label>
                <textarea
                  rows={5}
                  value={csSolutions}
                  onChange={(e) => setCsSolutions(e.target.value)}
                  placeholder="Detail the technical decisions, protocols, concurrency models, and storage choices used to solve the problem..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-xs leading-relaxed focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground">
                  Key Outcomes &amp; Lessons Learned (one per line)
                </label>
                <textarea
                  rows={3}
                  value={csLessons}
                  onChange={(e) => setCsLessons(e.target.value)}
                  placeholder="Reduced latency by 45%&#10;Zero-downtime MongoDB schema migrations&#10;Optimized socket connection pooling"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-xs font-mono leading-relaxed focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          {/* TAB 7: LINKS & SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground">Live Production URL</label>
                  <input
                    type="text"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground">GitHub Repository URL</label>
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/Rahul-2148/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground">Case Study URL (Optional override)</label>
                <input
                  type="text"
                  value={caseStudyUrl}
                  onChange={(e) => setCaseStudyUrl(e.target.value)}
                  placeholder="Leave empty to use default /work/[slug]"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <span className="text-xs font-mono text-foreground font-bold uppercase">SEO &amp; OpenGraph Metadata</span>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground">Meta Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Leave empty for auto-generated title"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground">Meta Description</label>
                  <input
                    type="text"
                    value={seoDesc}
                    onChange={(e) => setSeoDesc(e.target.value)}
                    placeholder="Leave empty for auto-generated description"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground">OG Image URL</label>
                  <input
                    type="text"
                    value={seoOgImage}
                    onChange={(e) => setSeoOgImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-border bg-surface/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">Status:</span>
              <span
                className={`px-2.5 py-1 rounded-md text-xs font-mono uppercase font-bold ${
                  status === 'published'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : status === 'draft'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-muted text-muted-foreground border border-border'
                }`}
              >
                {status}
              </span>
            </div>
            {/* Mobile cancel button */}
            <button
              type="button"
              onClick={onClose}
              className="sm:hidden px-3 py-1.5 rounded-lg border border-border text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="hidden sm:inline-flex px-4 py-2 rounded-xl border border-border text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSubmit('draft')}
              className="flex-1 sm:flex-initial px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl bg-surface-elevated hover:bg-muted border border-border text-xs font-mono text-foreground font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSubmit('published')}
              className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 sm:py-2 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-mono font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-md shadow-primary/20 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{saving ? 'Publishing...' : 'Publish to Live'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
