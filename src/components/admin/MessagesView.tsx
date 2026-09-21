'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  Search,
  RefreshCw,
  Trash2,
  Reply,
  CheckCircle,
  Archive,
  Inbox,
  Clock,
  ExternalLink,
  DollarSign,
  Building,
} from 'lucide-react';

export interface ContactMessageItem {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  projectType?: string;
  budget?: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  sourceUrl?: string;
  repliedAt?: string;
  createdAt: string;
}

interface MessagesViewProps {
  onCountChange?: (counts: { all: number; unread: number; read: number; replied: number; archived: number }) => void;
}

export function MessagesView({ onCountChange }: MessagesViewProps) {
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [counts, setCounts] = useState({ all: 0, unread: 0, read: 0, replied: 0, archived: 0 });
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'replied' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      let url = `/api/admin/messages?status=${statusFilter}`;
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        if (data.counts) {
          setCounts(data.counts);
          onCountChange?.(data.counts);
        }
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery, onCountChange]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleUpdateStatus = async (id: string, newStatus: 'unread' | 'read' | 'replied' | 'archived') => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchMessages();
        if (selectedMessage?._id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error('Failed to update message status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this contact transmission?')) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchMessages();
        if (selectedMessage?._id === id) setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>Inbound Transmissions</span>
          </div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
            Contact Inquiries &amp; Messages
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono">
            {counts.unread} unread • {counts.all} total inquiries recorded in MongoDB
          </p>
        </div>

        <button
          onClick={() => fetchMessages()}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-surface hover:bg-muted border border-border text-xs font-mono text-foreground flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-primary ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Transmissions</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-mono text-xs">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-card border border-border overflow-x-auto">
          {[
            { id: 'all', label: 'All Inquiries', count: counts.all, icon: Inbox },
            { id: 'unread', label: 'Unread', count: counts.unread, icon: Mail, highlight: counts.unread > 0 },
            { id: 'read', label: 'Read', count: counts.read, icon: CheckCircle },
            { id: 'replied', label: 'Replied', count: counts.replied, icon: Reply },
            { id: 'archived', label: 'Archived', count: counts.archived, icon: Archive },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-black/20 text-white'
                      : tab.highlight
                      ? 'bg-primary/20 text-primary'
                      : 'bg-surface-elevated text-muted-foreground'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by sender, email, subject..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-card border border-border text-foreground text-xs focus:outline-none focus:border-primary font-mono placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-muted-foreground flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-primary" />
            <span>Retrieving transmissions...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-16 rounded-3xl bg-card border border-dashed border-border text-center space-y-3 font-mono">
            <Inbox className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <div className="text-sm font-bold text-foreground">No Transmissions Found</div>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery
                ? `No transmissions matched "${searchQuery}".`
                : statusFilter === 'unread'
                ? 'All caught up! No unread messages in your inbox.'
                : 'Inquiries submitted through the contact portal will appear here.'}
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isUnread = msg.status === 'unread';
            const isSelected = selectedMessage?._id === msg._id;
            const dateStr = new Date(msg.createdAt).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            });

            return (
              <div
                key={msg._id}
                className={`p-5 sm:p-6 rounded-2xl bg-card border transition-all ${
                  isUnread
                    ? 'border-primary/40 shadow-sm bg-primary/[0.02]'
                    : isSelected
                    ? 'border-border-accent'
                    : 'border-border hover:border-border-accent'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3 border-b border-border">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{msg.name}</span>
                      <span className="text-xs font-mono text-muted-foreground">&lt;{msg.email}&gt;</span>

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          msg.status === 'unread'
                            ? 'bg-primary/20 text-primary border border-primary/30'
                            : msg.status === 'replied'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : msg.status === 'archived'
                            ? 'bg-surface-elevated text-muted-foreground border border-border'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {msg.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-foreground font-mono">
                      {msg.subject || 'Portfolio Inquiry'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{dateStr}</span>
                  </div>
                </div>

                {/* Metadata Tags: Company, Budget, Project Type */}
                {(msg.company || msg.budget || msg.projectType) && (
                  <div className="flex flex-wrap items-center gap-2 pt-3 pb-1 text-[11px] font-mono">
                    {msg.company && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-surface border border-border text-muted-foreground">
                        <Building className="w-3 h-3 text-primary" />
                        <span>{msg.company}</span>
                      </span>
                    )}
                    {msg.projectType && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-surface border border-border text-cyan-400">
                        <span>{msg.projectType}</span>
                      </span>
                    )}
                    {msg.budget && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-surface border border-border text-emerald-400 font-bold">
                        <DollarSign className="w-3 h-3" />
                        <span>{msg.budget}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Message Body */}
                <div className="pt-3 pb-4 text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans whitespace-pre-wrap">
                  {msg.message}
                </div>

                {/* Action Bar */}
                <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Reply via Email */}
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}&body=${encodeURIComponent('\n\n--- Original Message from ' + msg.name + ' ---\n' + msg.message)}`}
                      onClick={() => {
                        if (msg.status === 'unread') {
                          handleUpdateStatus(msg._id, 'replied');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-bold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                      <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                    </a>

                    {/* Toggle Read/Unread */}
                    <button
                      onClick={() => handleUpdateStatus(msg._id, isUnread ? 'read' : 'unread')}
                      className="px-3 py-1.5 rounded-xl bg-surface hover:bg-muted border border-border text-foreground transition-colors"
                    >
                      {isUnread ? 'Mark as Read' : 'Mark Unread'}
                    </button>

                    {/* Toggle Replied */}
                    {msg.status !== 'replied' && (
                      <button
                        onClick={() => handleUpdateStatus(msg._id, 'replied')}
                        className="px-3 py-1.5 rounded-xl bg-surface hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Mark Replied
                      </button>
                    )}

                    {/* Toggle Archive */}
                    <button
                      onClick={() =>
                        handleUpdateStatus(msg._id, msg.status === 'archived' ? 'read' : 'archived')
                      }
                      className="px-3 py-1.5 rounded-xl bg-surface hover:bg-muted border border-border text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {msg.status === 'archived' ? 'Unarchive' : 'Archive'}
                    </button>
                  </div>

                  {/* Delete Action */}
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="p-1.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Permanently Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
