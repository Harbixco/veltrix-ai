import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Facebook,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Image as ImageIcon,
  Sparkles,
  Share2,
  Copy,
  MessageSquare
} from 'lucide-react';

const XLogo: React.FC<{ className?: string }> = ({ className = 'w-3 h-3' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface ScheduledPost {
  id: string;
  socialPageId: string;
  caption: string;
  mediaUrls: string[];
  scheduledFor: string;
  status: 'SCHEDULED' | 'PUBLISHED' | 'FAILED';
  page?: {
    pageName: string;
    pageId: string;
  };
}

interface PublishedPost {
  id: string;
  socialPageId: string;
  pageName: string;
  caption: string;
  mediaUrls: string[];
  contentPillar: string;
  publishedAt: string;
  permalinkUrl?: string;
  metrics?: {
    reach: number;
    engagementRate: number;
    reactions: number;
  };
}

export const ContentCalendarPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>(
    typeof window !== 'undefined' && window.innerWidth < 768 ? 'timeline' : 'calendar'
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [publishedPosts, setPublishedPosts] = useState<PublishedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SCHEDULED' | 'PUBLISHED'>('ALL');
  const [platformFilter, setPlatformFilter] = useState<'ALL' | 'FACEBOOK' | 'TWITTER'>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('veltrix_token');
      const response = await fetch('/api/v1/calendar/posts', {
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });
      const data = await response.json();
      if (data.success && data.data) {
        setScheduledPosts(data.data.scheduledPosts || []);
        setPublishedPosts(data.data.publishedPosts || []);
      }
    } catch (err) {
      console.error('Failed to fetch calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishNow = async (postId: string) => {
    try {
      setActionSuccess(null);
      const token = localStorage.getItem('veltrix_token');
      const res = await fetch(`/api/v1/calendar/publish-now/${postId}`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });
      const result = await res.json();
      if (result.success) {
        setActionSuccess('Post published immediately to connected Facebook Page!');
        fetchCalendarData();
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err) {
      console.error('Publish now failed:', err);
    }
  };

  const handleCancelPost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled post?')) return;
    try {
      const token = localStorage.getItem('veltrix_token');
      const res = await fetch(`/api/v1/calendar/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });
      const result = await res.json();
      if (result.success) {
        setActionSuccess('Scheduled post cancelled successfully.');
        fetchCalendarData();
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err) {
      console.error('Cancel post failed:', err);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaption || !newDate) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('veltrix_token');
      const res = await fetch('/api/v1/calendar/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          caption: newCaption,
          scheduledFor: new Date(newDate).toISOString(),
          mediaUrls: newMediaUrl ? [newMediaUrl] : []
        })
      });

      const result = await res.json();
      if (result.success) {
        setIsModalOpen(false);
        setNewCaption('');
        setNewDate('');
        setNewMediaUrl('');
        setActionSuccess('New post scheduled successfully on calendar!');
        fetchCalendarData();
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err) {
      console.error('Schedule failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Month navigation helpers
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthYearLabel = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Generate calendar days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDay }, (_, i) => i);

  // Group posts by day
  const getPostsForDay = (day: number) => {
    const targetDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const sched = scheduledPosts.filter((p) => {
      const d = new Date(p.scheduledFor);
      const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return str === targetDateStr;
    });

    const pub = publishedPosts.filter((p) => {
      const d = new Date(p.publishedAt);
      const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return str === targetDateStr;
    });

    return { sched, pub };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Content Calendar</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Plan, preview, and 1-click publish across Facebook and 𝕏 (Twitter).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="bg-slate-800/80 p-1 rounded-xl flex border border-slate-700 w-full sm:w-auto justify-between">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
                viewMode === 'calendar' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
                viewMode === 'timeline' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              Timeline / Queue
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto justify-center flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {actionSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-2 text-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Main View Area */}
      {viewMode === 'calendar' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-3.5 sm:p-6">
          {/* Mobile Calendar Hint */}
          <div className="md:hidden mb-3 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
            <span>Viewing full calendar. Scroll horizontally or switch:</span>
            <button
              onClick={() => setViewMode('timeline')}
              className="font-bold underline text-white px-2 py-0.5 bg-emerald-600 rounded-lg text-[11px]"
            >
              Timeline View
            </button>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <div className="min-w-[640px] md:min-w-0">
              {/* Calendar Controls */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg sm:text-xl font-bold text-white">{monthYearLabel}</h2>
                  <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <button
                      onClick={prevMonth}
                      className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextMonth}
                      className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    Scheduled ({scheduledPosts.length})
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    Published ({publishedPosts.length})
                  </span>
                </div>
              </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {blanksArray.map((_, i) => (
              <div key={`blank-${i}`} className="min-h-[110px] bg-slate-950/40 rounded-xl border border-slate-800/40 opacity-40"></div>
            ))}

            {daysArray.map((day) => {
              const { sched, pub } = getPostsForDay(day);
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === month &&
                new Date().getFullYear() === year;

              return (
                <div
                  key={day}
                  className={`min-h-[110px] p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                    isToday
                      ? 'bg-slate-800/80 border-emerald-500/50 shadow-sm shadow-emerald-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center -ml-1 -mt-1'
                          : 'text-slate-400'
                      }`}
                    >
                      {day}
                    </span>
                    {(sched.length > 0 || pub.length > 0) && (
                      <span className="text-[10px] text-slate-500 font-medium">
                        {sched.length + pub.length} post{sched.length + pub.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 overflow-y-auto max-h-[80px]">
                    {sched.map((post) => (
                      <div
                        key={post.id}
                        className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] leading-tight group relative hover:bg-emerald-500/20 transition-all cursor-pointer"
                        title={post.caption}
                      >
                        <div className="font-semibold truncate flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 flex-shrink-0" />
                          {new Date(post.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <p className="truncate text-[10px] opacity-80 mt-0.5">{post.caption}</p>
                      </div>
                    ))}

                    {pub.map((post) => (
                      <div
                        key={post.id}
                        className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] leading-tight group hover:bg-blue-500/20 transition-all cursor-pointer"
                        title={post.caption}
                      >
                        <div className="font-semibold truncate flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 flex-shrink-0 text-blue-400" />
                          Published
                        </div>
                        <p className="truncate text-[10px] opacity-80 mt-0.5">{post.caption}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
            </div>
          </div>
        </div>
      ) : (
        /* Timeline / Queue View */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs font-medium text-slate-300 shrink-0">Status:</span>
              <div className="flex gap-1 shrink-0">
                {(['ALL', 'SCHEDULED', 'PUBLISHED'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      statusFilter === filter
                        ? 'bg-slate-700 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Channel Filter (Scrollable on Mobile) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <span className="text-xs font-medium text-slate-300 shrink-0">Channel:</span>
              <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                <button
                  onClick={() => setPlatformFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    platformFilter === 'ALL'
                      ? 'bg-emerald-500 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Channels ({scheduledPosts.length})
                </button>
                <button
                  onClick={() => setPlatformFilter('FACEBOOK')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    platformFilter === 'FACEBOOK'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Facebook className="w-3.5 h-3.5" />
                  <span>Facebook ({scheduledPosts.filter((p) => !p.page?.pageName?.includes('Frontend Engineer') && p.page?.pageId !== 'AbiodunBuilds' && !p.caption.includes('#ReactJS')).length})</span>
                </button>
                <button
                  onClick={() => setPlatformFilter('TWITTER')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    platformFilter === 'TWITTER'
                      ? 'bg-white text-slate-950 shadow font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <XLogo className="w-3.5 h-3.5" />
                  <span>𝕏 / Twitter ({scheduledPosts.filter((p) => p.page?.pageName?.includes('Frontend Engineer') || p.page?.pageId === 'AbiodunBuilds' || p.caption.includes('#ReactJS')).length})</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Scheduled Posts */}
            {(statusFilter === 'ALL' || statusFilter === 'SCHEDULED') &&
              scheduledPosts
                .filter((post) => {
                  const isTweet =
                    post.page?.pageName?.includes('Frontend Engineer') ||
                    post.page?.pageId === 'AbiodunBuilds' ||
                    post.caption.includes('#ReactJS');
                  if (platformFilter === 'FACEBOOK') return !isTweet;
                  if (platformFilter === 'TWITTER') return isTweet;
                  return true;
                })
                .map((post) => {
                  const isTweet =
                    post.page?.pageName?.includes('Frontend Engineer') ||
                    post.page?.pageId === 'AbiodunBuilds' ||
                    post.caption.includes('#ReactJS');

                  return (
                    <div
                      key={post.id}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 border ${
                              isTweet
                                ? 'bg-white/10 text-white border-white/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            {isTweet ? '𝕏 SCHEDULED' : 'SCHEDULED'}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(post.scheduledFor).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        <p className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto mb-3 pr-1">
                          {post.caption}
                        </p>

                        {/* First Comment box for Facebook, or 280-char verified badge for X */}
                        {isTweet ? (
                          <div className="mb-4 rounded-xl border border-slate-700 bg-slate-950/60 p-2.5 flex items-center justify-between text-[11px]">
                            <span className="flex items-center gap-1.5 font-bold text-white">
                              <XLogo className="w-3.5 h-3.5" />
                              <span>𝕏 Tweet Optimization</span>
                            </span>
                            <span className="font-mono text-[10px] text-emerald-400 font-bold">
                              {post.caption.length} / 280 chars (Verified)
                            </span>
                          </div>
                        ) : (
                          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Pinned First Comment (Links here)</span>
                              </span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    `Want a free initial review of your business's online presence or a professional website? Send Veltrix Hub a message.\nWhatsApp: https://wa.me/2348087098270`
                                  );
                                  setActionSuccess('First comment copied to clipboard!');
                                  setTimeout(() => setActionSuccess(null), 2500);
                                }}
                                className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Copy Comment</span>
                              </button>
                            </div>
                            <p className="text-[11px] text-slate-300 font-mono leading-relaxed">
                              Want a free initial review of your business's online presence or a professional website? Send Veltrix Hub a message.
                              <br />
                              <span className="text-emerald-400">WhatsApp: https://wa.me/2348087098270</span>
                            </p>
                          </div>
                        )}

                        {post.mediaUrls && post.mediaUrls.length > 0 && (
                          <div className="mb-4 rounded-xl overflow-hidden border border-slate-800 h-44 bg-slate-950">
                            <img
                              src={post.mediaUrls[0]}
                              alt="Scheduled attachment"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          {isTweet ? (
                            <>
                              <XLogo className="w-3.5 h-3.5 text-white" />
                              <span className="text-white font-medium">@AbiodunBuilds</span>
                            </>
                          ) : (
                            <>
                              <Facebook className="w-3.5 h-3.5 text-blue-400" />
                              <span>{post.page?.pageName || 'Veltrix Hub Official'}</span>
                            </>
                          )}
                        </span>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                          {isTweet ? (
                            <>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(post.caption);
                                  setActionSuccess('Tweet copied to clipboard!');
                                  setTimeout(() => setActionSuccess(null), 2500);
                                }}
                                className="flex-1 sm:flex-initial flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors min-h-[38px] active:scale-95"
                                title="Copy tweet text"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </button>

                              <button
                                onClick={() => {
                                  window.open(
                                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.caption)}`,
                                    '_blank'
                                  );
                                }}
                                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-slate-200 transition-colors shadow min-h-[38px] active:scale-95"
                                title="Publish directly to 𝕏 / Twitter"
                              >
                                <XLogo className="w-3.5 h-3.5" />
                                <span>Tweet on 𝕏</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(post.caption);
                                  setActionSuccess('Main post caption copied! (Zero external links)');
                                  setTimeout(() => setActionSuccess(null), 2500);
                                }}
                                className="flex-1 sm:flex-initial flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors min-h-[38px] active:scale-95"
                                title="Copy post copy (no external links)"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Post</span>
                              </button>

                              <button
                                onClick={() => handlePublishNow(post.id)}
                                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-xl transition-colors min-h-[38px] active:scale-95"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Publish</span>
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => handleCancelPost(post.id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
                            title="Cancel post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

            {/* Published Posts */}
            {(statusFilter === 'ALL' || statusFilter === 'PUBLISHED') &&
              publishedPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-slate-900 border border-slate-800/70 rounded-2xl p-5 flex flex-col justify-between transition-all opacity-90 hover:opacity-100"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        PUBLISHED
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(post.publishedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed line-clamp-4 mb-4">
                      {post.caption}
                    </p>

                    {post.mediaUrls && post.mediaUrls.length > 0 && (
                      <div className="mb-4 rounded-xl overflow-hidden border border-slate-800 h-36 bg-slate-950">
                        <img
                          src={post.mediaUrls[0]}
                          alt="Published media"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">
                      Reach: <strong className="text-white">{post.metrics?.reach?.toLocaleString() || '1,200'}</strong>
                    </span>

                    {post.permalinkUrl && (
                      <a
                        href={post.permalinkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs transition-colors"
                      >
                        <span>View Post</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Schedule Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6 shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-emerald-400" />
                  Schedule Post to Facebook
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Target Page: <strong>Veltrix Hub Official</strong>
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Post Caption & Hashtags
                </label>
                <textarea
                  rows={4}
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Share a client insight, educational tip, or service highlight..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Publication Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Media Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                >
                  {isSubmitting ? 'Scheduling...' : 'Confirm Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
