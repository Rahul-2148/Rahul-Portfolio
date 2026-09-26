'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Lock,
  Unlock,
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
  Briefcase,
  GraduationCap,
  Code2,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  ExternalLink,
  Save,
  Sparkles,
  Layers,
  Eye,
  EyeOff,
  KeyRound,
  LogOut,
  Search as SearchIcon,
  ArrowUp,
  ArrowDown,
  Star,
  Clock,
  Settings,
  FolderKanban,
  Activity,
  BarChart3,
  Mail,
  FileText,
  Award,
  Upload,
  Cloud,
  PanelLeft,
  PanelLeftClose,
} from 'lucide-react';
import { Project, Experience, Education, Skill, PersonalInfo, ResumeItem, Achievement } from '@/types';
import { ProjectModal } from '@/components/admin/ProjectModal';
import { LiveVisitorsView } from '@/components/admin/LiveVisitorsView';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { SkillsView } from '@/components/admin/SkillsView';
import { MessagesView } from '@/components/admin/MessagesView';
import { ResumesView } from '@/components/admin/ResumesView';
import { EducationView } from '@/components/admin/EducationView';
import { AchievementsView } from '@/components/admin/AchievementsView';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState('');

  // 4-Digit Security PIN & Passkey State
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '']);
  const pin0Ref = useRef<HTMLInputElement>(null);
  const pin1Ref = useRef<HTMLInputElement>(null);
  const pin2Ref = useRef<HTMLInputElement>(null);
  const pin3Ref = useRef<HTMLInputElement>(null);
  const pinInputRefs = [pin0Ref, pin1Ref, pin2Ref, pin3Ref];

  const [pinShaking, setPinShaking] = useState(false);
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const [maskPin, setMaskPin] = useState(true);
  const [useFullPasskey, setUseFullPasskey] = useState(false);

  // 6-Digit Email OTP Box State
  const [otpBoxes, setOtpBoxes] = useState<string[]>(['', '', '', '', '', '']);
  const otp0Ref = useRef<HTMLInputElement>(null);
  const otp1Ref = useRef<HTMLInputElement>(null);
  const otp2Ref = useRef<HTMLInputElement>(null);
  const otp3Ref = useRef<HTMLInputElement>(null);
  const otp4Ref = useRef<HTMLInputElement>(null);
  const otp5Ref = useRef<HTMLInputElement>(null);
  const otpInputRefs = [otp0Ref, otp1Ref, otp2Ref, otp3Ref, otp4Ref, otp5Ref];

  // Passkey & Biometric Authentication State
  const [biometricState, setBiometricState] = useState<'idle' | 'scanning' | 'granted' | 'failed'>('idle');
  const [biometricStatusText, setBiometricStatusText] = useState('Verify with Biometrics');
  const [hasHardwareBiometrics, setHasHardwareBiometrics] = useState(false);
  const [isHardwareEnrolled, setIsHardwareEnrolled] = useState(false);
  const autoPromptAttemptedRef = useRef(false);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'projects' | 'skills' | 'live' | 'analytics' | 'messages' | 'resumes' | 'education' | 'achievements' | 'experience' | 'settings' | 'security' | 'audit'
  >('overview');

  // Desktop Collapsible Sidebar State (true = icon only, false = full width)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Gate State (Login vs Email OTP Reset)
  const [authMode, setAuthMode] = useState<'login' | 'email_otp'>('login');

  // Email OTP Reset State
  const adminEmail = 'rahulraj21480@gmail.com';
  const [otpCode, setOtpCode] = useState('');
  const [otpNewPasscode, setOtpNewPasscode] = useState('');
  const [otpConfirmPasscode, setOtpConfirmPasscode] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpSentNotice, setOtpSentNotice] = useState<string | null>(null);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  // Security Tab State
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [securityMsg, setSecurityMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdatingPasscode, setIsUpdatingPasscode] = useState(false);

  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectFilter, setProjectFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [projectSearch, setProjectSearch] = useState('');
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Reusable Skills State
  const [skills, setSkills] = useState<Skill[]>([]);

  // Live Presence State
  const [onlineCount, setOnlineCount] = useState(0);

  // Inquiries State
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  // Audit Logs State

  interface AuditLogItem {
    action: string;
    resource: string;
    details?: Record<string, unknown>;
    timestamp: string;
  }
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  // Portfolio Experience, Education, Settings State
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: 'Rahul Raj',
    role: 'Full-Stack Engineer',
    tagline: 'AI × Product × Real-Time Systems',
    bio: '',
    github: 'https://github.com/Rahul-2148',
    linkedin: 'https://linkedin.com/in/rahulraj2148',
    twitter: 'https://x.com/rahulraj2148',
    instagram: 'https://instagram.com/rahulraj2148',
    leetcode: 'https://leetcode.com/u/rahulraj2148',
    codeforces: 'https://codeforces.com/profile/rahulraj2148',
    email: 'rahulraj21480@gmail.com',
    location: 'India',
    available: true,
    resumeUrl: '',
  });

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Avatar Upload State (Cloudinary)
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Cloudinary Configuration States
  const [cloudName, setCloudName] = useState('');
  const [cloudApiKey, setCloudApiKey] = useState('');
  const [cloudApiSecret, setCloudApiSecret] = useState('');
  const [cloudStatus, setCloudStatus] = useState<string | null>(null);
  const [testingCloud, setTestingCloud] = useState(false);
  const [cloudConnected, setCloudConnected] = useState(false);

  const fetchCloudinaryConfig = async () => {
    try {
      const res = await fetch('/api/admin/cloudinary/status');
      if (res.ok) {
        const data = await res.json();
        if (data.cloudName) setCloudName(data.cloudName);
        setCloudConnected(Boolean(data.connected));
        if (data.connected) {
          setCloudStatus(`Connected to Cloudinary CDN (${data.cloudName})`);
        } else {
          setCloudStatus(data.message || 'Credentials not configured. Using local disk fallback.');
        }
      }
    } catch {
      // ignore
    }
  };

  const handleSaveCloudinary = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestingCloud(true);
    setCloudStatus(null);
    try {
      const res = await fetch('/api/admin/cloudinary/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cloudName: cloudName.trim(),
          apiKey: cloudApiKey.trim(),
          apiSecret: cloudApiSecret.trim(),
        }),
      });
      const data = await res.json();
      setCloudConnected(Boolean(data.connected));
      if (data.connected) {
        setCloudStatus(`Successfully connected to Cloudinary CDN (${data.cloudName})!`);
      } else {
        setCloudStatus(data.message || 'Saved, but connection check returned warnings.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save error';
      setCloudStatus(`Error: ${msg}`);
    } finally {
      setTestingCloud(false);
    }
  };

  const fetchPortfolioData = async () => {
    try {
      const res = await fetch('/api/admin/portfolio');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setPersonalInfo(json.data.personalInfo || personalInfo);
          setExperiences(json.data.experiences || []);
          setEducations(json.data.educations || []);
          setResumes(json.data.resumes || []);
          setAchievements(json.data.achievements || []);
        }
      }
    } catch (err) {
      console.error('Failed to refresh portfolio data:', err);
    }
  };

  // 1. Check existing session and platform hardware biometrics on mount
  useEffect(() => {
    async function verifyAuth() {
      try {
        const authRes = await fetch('/api/admin/auth');
        const authData = await authRes.json();
        if (authRes.ok && authData.authenticated) {
          setIsAuthenticated(true);
          try {
            const res = await fetch('/api/admin/portfolio');
            if (res.ok) {
              const json = await res.json();
              if (json.data) {
                setPersonalInfo(json.data.personalInfo || personalInfo);
                setExperiences(json.data.experiences || []);
                setEducations(json.data.educations || []);
                setResumes(json.data.resumes || []);
                setAchievements(json.data.achievements || []);
              }
            }
          } catch {
            // Portfolio data load non-fatal
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    }

    async function checkHardwareBiometrics() {
      if (typeof window !== 'undefined' && window.PublicKeyCredential) {
        try {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setHasHardwareBiometrics(Boolean(available));
          const savedCredId = localStorage.getItem('portfolio_webauthn_cred_id');
          if (savedCredId) {
            setIsHardwareEnrolled(true);
          }
        } catch {
          // not supported
        }
      }
    }

    verifyAuth();
    checkHardwareBiometrics();

    // Re-verify if user navigates back using browser Back button (handles bfcache)
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        verifyAuth();
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  // 2. Fetch Projects, Skills, Presence, and Audit Logs once authenticated
  const fetchAllAdminData = async () => {
    if (!isAuthenticated) return;
    try {
      setLoadingProjects(true);
      // Fetch Projects
      const projRes = await fetch('/api/admin/projects');
      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(projData.projects || []);
      }

      // Fetch Skills
      const skillRes = await fetch('/api/admin/skills');
      if (skillRes.ok) {
        const skillData = await skillRes.json();
        setSkills(skillData.skills || []);
      }

      // Fetch Presence
      const presenceRes = await fetch('/api/analytics/presence');
      if (presenceRes.ok) {
        const presenceData = await presenceRes.json();
        setOnlineCount(presenceData.onlineCount || 0);
      }

      // Fetch Audit Logs
      const auditRes = await fetch('/api/admin/audit-logs');
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setAuditLogs(auditData.logs || []);
      }

      // Fetch Unread Messages Count
      const msgRes = await fetch('/api/admin/messages?status=unread');
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        if (msgData.counts) {
          setUnreadMessagesCount(msgData.counts.unread || 0);
        }
      }

      // Fetch Cloudinary Credentials Status
      await fetchCloudinaryConfig();
    } catch {
      // Fail safely
    } finally {
      setLoadingProjects(false);
    }
  };


  useEffect(() => {
    if (isAuthenticated) {
      fetchAllAdminData();
      // Presence polling
      const presenceInterval = setInterval(async () => {
        try {
          const res = await fetch('/api/analytics/presence');
          if (res.ok) {
            const data = await res.json();
            setOnlineCount(data.onlineCount || 0);
          }
        } catch {}
      }, 5000);
      return () => clearInterval(presenceInterval);
    }
  }, [isAuthenticated]);

  // Subtle Audio & Haptic Feedback for PIN Keypad
  const playAudioTone = (freq = 600, duration = 0.12) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext unavailable or blocked
    }
  };

  const triggerHaptic = (pattern: number | number[] = 20) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {}
    }
  };

  // Execute PIN Verification (Auto-called on 4th box)
  const executePinVerification = async (enteredPin: string) => {
    setIsVerifyingPin(true);
    setAuthError('');
    playAudioTone(700, 0.1);
    triggerHaptic(25);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: enteredPin }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerHaptic([40, 60, 100]);
        playAudioTone(960, 0.2);
        setIsAuthenticated(true);
      } else {
        triggerHaptic([80, 50, 80]);
        setPinShaking(true);
        setAuthError(data.error || 'Invalid 4-Digit Security PIN.');
        setTimeout(() => {
          setPinShaking(false);
          setPinDigits(['', '', '', '']);
          pinInputRefs[0].current?.focus();
        }, 500);
      }
    } catch {
      setAuthError('Connection failure during authentication.');
    } finally {
      setIsVerifyingPin(false);
    }
  };

  // Native Platform Passkey / Biometrics Enrollment (Windows Hello / Touch ID / Face ID)
  const handleHardwareBiometricEnroll = async () => {
    if (typeof window === 'undefined' || !window.PublicKeyCredential) {
      alert('Your browser or operating system does not support native WebAuthn passkeys.');
      return;
    }

    setBiometricState('scanning');
    setBiometricStatusText('Awaiting biometric confirmation (Sensor / Face ID)...');
    triggerHaptic([30, 45, 30]);

    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const userId = new Uint8Array(16);
      window.crypto.getRandomValues(userId);

      const credential = (await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: 'Rahul Raj Portfolio Admin', id: window.location.hostname },
          user: {
            id: userId,
            name: 'rahulraj21480@gmail.com',
            displayName: 'Rahul Raj (Owner)',
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 }, // ES256 (Mobile & Mac)
            { type: 'public-key', alg: -257 }, // RS256 (Windows Hello)
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform', // Physical platform authenticator
            userVerification: 'required',
          },
          timeout: 60000,
        },
      })) as PublicKeyCredential | null;

      if (credential) {
        const rawIdArray = new Uint8Array(credential.rawId);
        let binary = '';
        for (let i = 0; i < rawIdArray.byteLength; i++) {
          binary += String.fromCharCode(rawIdArray[i]);
        }
        const base64Id = btoa(binary);

        localStorage.setItem('portfolio_webauthn_cred_id', base64Id);
        setIsHardwareEnrolled(true);

        const res = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'webauthn_register',
            credentialId: base64Id,
            deviceType: navigator.userAgent.includes('Mobile') ? 'Mobile-Biometrics' : 'Desktop-Passkey',
            pin: pinDigits.join('') || '2148',
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setBiometricState('granted');
          setBiometricStatusText('Passkey registered successfully! Unlocking...');
          triggerHaptic([50, 100, 200]);
          setTimeout(() => {
            setIsAuthenticated(true);
            setBiometricState('idle');
          }, 600);
        } else {
          setBiometricState('failed');
          setBiometricStatusText(data.error || 'Registration failed');
          setTimeout(() => setBiometricState('idle'), 1500);
        }
      }
    } catch (err: unknown) {
      console.warn('Passkey registration cancelled/error:', err);
      setBiometricState('idle');
      setBiometricStatusText('Passkey setup cancelled');
      setTimeout(() => {
        setBiometricStatusText('Verify with Biometrics or enter PIN');
      }, 1500);
    }
  };

  // Biometric & Passkey Authentication Handler
  const handleBiometricAuth = async (isAutoTrigger = false) => {
    if (biometricState === 'scanning' || isVerifyingPin) return;

    const savedCredId = typeof window !== 'undefined' ? localStorage.getItem('portfolio_webauthn_cred_id') : null;

    // A. If Passkey / Biometrics is enrolled on this device, trigger native OS prompt!
    if (typeof window !== 'undefined' && window.PublicKeyCredential && savedCredId) {
      setBiometricState('scanning');
      setBiometricStatusText('Verifying biometric credentials...');
      triggerHaptic([35, 45, 35]);

      try {
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        const binary = atob(savedCredId);
        const credIdArray = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          credIdArray[i] = binary.charCodeAt(i);
        }

        // Native OS WebAuthn Prompt (Windows Hello / Touch ID / Face ID)
        const assertion = (await navigator.credentials.get({
          publicKey: {
            challenge,
            timeout: 60000,
            userVerification: 'required',
            rpId: window.location.hostname,
            allowCredentials: [
              {
                id: credIdArray,
                type: 'public-key',
              },
            ],
          },
        })) as PublicKeyCredential | null;

        if (assertion) {
          setBiometricState('granted');
          setBiometricStatusText('Identity verified. Welcome!');
          triggerHaptic([50, 80, 160]);

          const res = await fetch('/api/admin/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'webauthn_verify',
              credentialId: savedCredId,
            }),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setTimeout(() => {
              setIsAuthenticated(true);
              setBiometricState('idle');
            }, 300);
            return;
          }
        }
      } catch (err: unknown) {
        console.warn('Biometric prompt cancelled/dismissed:', err);
        setBiometricState('idle');
        if (!isAutoTrigger) {
          setBiometricStatusText('Verification cancelled. Enter PIN to access.');
        } else {
          setBiometricStatusText('Verify with Biometrics or enter PIN');
        }
        return;
      }
    }

    // B. If hardware is available but not yet enrolled, prompt registration on click
    if (!isAutoTrigger && typeof window !== 'undefined' && window.PublicKeyCredential && hasHardwareBiometrics && !savedCredId) {
      await handleHardwareBiometricEnroll();
      return;
    }

    // C. Instant Biometric Passcode Verification (Fallback)
    if (!isAutoTrigger) {
      setBiometricState('scanning');
      setBiometricStatusText('Verifying authorization...');
      triggerHaptic([35, 45, 35]);

      try {
        const res = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'biometric_login', biometric: true }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setBiometricState('granted');
          setBiometricStatusText('Access granted. Welcome!');
          triggerHaptic([50, 80, 160]);
          setTimeout(() => {
            setIsAuthenticated(true);
            setBiometricState('idle');
          }, 300);
        } else {
          setBiometricState('failed');
          setBiometricStatusText('Authentication failed. Use PIN.');
          triggerHaptic([100, 60, 100]);
          setTimeout(() => {
            setBiometricState('idle');
            setBiometricStatusText('Verify with Biometrics or enter PIN');
          }, 1500);
        }
      } catch {
        setBiometricState('failed');
        setBiometricStatusText('Connection error');
        setTimeout(() => {
          setBiometricState('idle');
          setBiometricStatusText('Verify with Biometrics or enter PIN');
        }, 1500);
      }
    }
  };

  // Auto-prompt native biometric verification on page load if enrolled on this device
  useEffect(() => {
    if (
      !checkingAuth &&
      !isAuthenticated &&
      authMode === 'login' &&
      isHardwareEnrolled &&
      !autoPromptAttemptedRef.current
    ) {
      autoPromptAttemptedRef.current = true;
      const autoTimer = setTimeout(() => {
        handleBiometricAuth(true);
      }, 300);
      return () => clearTimeout(autoTimer);
    }
  }, [checkingAuth, isAuthenticated, authMode, isHardwareEnrolled]);

  // Mobile Keypad Handlers
  const handleKeypadPress = (digit: string) => {
    triggerHaptic(18);
    playAudioTone(480 + parseInt(digit, 10) * 35, 0.06);
    const emptyIndex = pinDigits.findIndex((d) => d === '');
    if (emptyIndex !== -1) {
      const nextPin = [...pinDigits];
      nextPin[emptyIndex] = digit;
      setPinDigits(nextPin);
      if (emptyIndex < 3) {
        pinInputRefs[emptyIndex + 1].current?.focus();
      } else if (emptyIndex === 3) {
        executePinVerification(nextPin.join(''));
      }
    }
  };

  const handleKeypadBackspace = () => {
    triggerHaptic(15);
    playAudioTone(420, 0.06);
    const lastFilledIdx = [3, 2, 1, 0].find((i) => pinDigits[i] !== '');
    if (lastFilledIdx !== undefined) {
      const nextPin = [...pinDigits];
      nextPin[lastFilledIdx] = '';
      setPinDigits(nextPin);
      pinInputRefs[lastFilledIdx].current?.focus();
    }
  };

  // PIN Individual Box Handlers
  const handlePinChange = (index: number, val: string) => {
    const cleanDigit = val.replace(/\D/g, '').slice(-1);
    const nextPin = [...pinDigits];
    nextPin[index] = cleanDigit;
    setPinDigits(nextPin);

    if (cleanDigit) {
      triggerHaptic(15);
      if (index < 3) {
        pinInputRefs[index + 1].current?.focus();
      } else if (index === 3 && nextPin.every((d) => d !== '')) {
        executePinVerification(nextPin.join(''));
      }
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!pinDigits[index] && index > 0) {
        e.preventDefault();
        pinInputRefs[index - 1].current?.focus();
        const nextPin = [...pinDigits];
        nextPin[index - 1] = '';
        setPinDigits(nextPin);
      }
    }
  };

  const handlePinPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (pasted.length === 4 && /^\d+$/.test(pasted)) {
      const chars = pasted.split('');
      setPinDigits(chars);
      executePinVerification(pasted);
    } else if (pasted.length > 0) {
      executePinVerification(pasted);
    }
  };

  // OTP 6-Box Handlers
  const handleOtpBoxChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const nextOtp = [...otpBoxes];
    nextOtp[index] = digit;
    setOtpBoxes(nextOtp);
    const joined = nextOtp.join('');
    setOtpCode(joined);

    if (digit) {
      triggerHaptic(15);
      if (index < 5) {
        otpInputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleOtpBoxKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpBoxes[index] && index > 0) {
        e.preventDefault();
        otpInputRefs[index - 1].current?.focus();
        const nextOtp = [...otpBoxes];
        nextOtp[index - 1] = '';
        setOtpBoxes(nextOtp);
        setOtpCode(nextOtp.join(''));
      }
    }
  };

  const handleOtpBoxPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const nextOtp = [...otpBoxes];
      pasted.split('').forEach((char, i) => {
        if (i < 6) nextOtp[i] = char;
      });
      setOtpBoxes(nextOtp);
      setOtpCode(nextOtp.join(''));
      if (pasted.length === 6) {
        otpInputRefs[5].current?.focus();
      } else {
        otpInputRefs[Math.min(pasted.length, 5)].current?.focus();
      }
    }
  };

  // Handle Legacy Login Form
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || 'Invalid passcode');
      }
    } catch {
      setAuthError('Authentication request failed. Check server status.');
    }
  };

  // Handle Email OTP Send
  const handleSendEmailOtp = async () => {
    setSendingOtp(true);
    setAuthError('');
    setOtpSentNotice(null);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_email_otp' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSentNotice(data.message);
        if (data.devOtp) {
          setDevOtpHint(data.devOtp);
        }
        setOtpCooldown(60);
      } else {
        setAuthError(data.error || 'Failed to dispatch OTP.');
      }
    } catch {
      setAuthError('Network error while requesting OTP.');
    } finally {
      setSendingOtp(false);
    }
  };

  // Handle Email OTP Verify & Reset
  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const finalOtp = (otpCode || otpBoxes.join('')).trim();
    if (!finalOtp || finalOtp.length !== 6) {
      setAuthError('Please enter a 6-digit verification code.');
      return;
    }
    if (otpNewPasscode !== otpConfirmPasscode) {
      setAuthError('New passcodes do not match.');
      return;
    }
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_email_otp',
          otpCode: finalOtp,
          newPasscode: otpNewPasscode,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSentNotice(data.message || 'Passcode successfully reset!');
        setTimeout(() => {
          setIsAuthenticated(true);
        }, 1200);
      } else {
        setAuthError(data.error || 'Invalid or expired OTP code.');
      }
    } catch {
      setAuthError('Verification failed.');
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
    } catch {
      // Proceed with client cleanup even if network fails
    }
    document.cookie = 'portfolio_admin_token=; Max-Age=0; path=/;';
    setIsAuthenticated(false);
    setPasscode('');
    setPinDigits(['', '', '', '']);
    setOtpBoxes(['', '', '', '', '', '']);
    setBiometricState('idle');
    autoPromptAttemptedRef.current = false;
    window.location.replace('/admin');
  };

  // Handle Project Save from Modal (Create or Edit)
  const handleSaveProjectFromModal = async (projectData: Partial<Project>) => {
    const isEdit = Boolean(selectedProjectForModal?._id || selectedProjectForModal?.slug);
    const url = isEdit
      ? `/api/admin/projects/${selectedProjectForModal?._id || selectedProjectForModal?.slug}`
      : '/api/admin/projects';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });

    if (!res.ok) {
      const errJson = await res.json();
      throw new Error(errJson.error || 'Failed to save project');
    }

    setSaveStatus('Project saved successfully!');
    setTimeout(() => setSaveStatus(null), 3000);
    await fetchAllAdminData();
  };

  // Handle Project Delete
  const handleDeleteProject = async (p: Project) => {
    if (!confirm(`Are you sure you want to delete project "${p.name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/projects/${p._id || p.slug}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSaveStatus(`Deleted ${p.name}`);
        setTimeout(() => setSaveStatus(null), 3000);
        await fetchAllAdminData();
      }
    } catch {
      alert('Failed to delete project');
    }
  };

  // Handle Project Status Toggle
  const handleToggleProjectStatus = async (p: Project, nextStatus: 'published' | 'draft' | 'archived') => {
    try {
      const res = await fetch(`/api/admin/projects/${p._id || p.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        await fetchAllAdminData();
      }
    } catch {}
  };

  // Handle Project Feature Toggle
  const handleToggleFeatured = async (p: Project) => {
    try {
      const res = await fetch(`/api/admin/projects/${p._id || p.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !p.featured }),
      });
      if (res.ok) {
        await fetchAllAdminData();
      }
    } catch {}
  };

  // Handle Move Up / Move Down Ordering
  const handleMoveProject = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === projects.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...projects];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const payload = reordered.map((proj, idx) => ({
      id: proj._id || proj.slug,
      sortOrder: idx,
    }));

    setProjects(reordered);

    try {
      await fetch('/api/admin/projects/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload }),
      });
    } catch {
      await fetchAllAdminData();
    }
  };

  // Save Settings (PersonalInfo)
  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personalInfo),
      });
      if (res.ok) {
        setSaveStatus('Settings updated successfully!');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch {
      setSaveStatus('Failed to update settings.');
    } finally {
      setLoading(false);
    }
  };

  // Avatar Selection & Cloudinary Sync Handler
  const handleSelectAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', avatarFile);
      formData.append('type', 'avatar');

      const res = await fetch('/api/admin/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPersonalInfo((prev) => ({
          ...prev,
          avatarUrl: data.url,
          avatarPublicId: data.publicId,
        }));
        setAvatarFile(null);
        setAvatarPreview(null);
        setSaveStatus('Profile avatar uploaded & synchronized with Cloudinary & DB!');
        setTimeout(() => setSaveStatus(null), 4000);
        await fetchPortfolioData();
      } else {
        alert(data.error || 'Failed to upload profile avatar.');
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      alert('Network error while uploading avatar.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (
      !confirm(
        'Are you sure you want to remove your custom avatar and revert to local /assets/rahul.jpg? This will also clean up the image from Cloudinary.'
      )
    ) {
      return;
    }

    try {
      if (personalInfo.avatarPublicId) {
        await fetch('/api/admin/cloudinary/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            publicId: personalInfo.avatarPublicId,
            resourceType: 'image',
          }),
        });
      }

      const updatedInfo = { ...personalInfo, avatarUrl: '', avatarPublicId: '' };
      setPersonalInfo(updatedInfo);
      setAvatarPreview(null);
      setAvatarFile(null);

      // Save directly to DB
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedInfo),
      });

      setSaveStatus('Avatar successfully deleted from Cloudinary & database synced!');
      setTimeout(() => setSaveStatus(null), 3500);
      await fetchPortfolioData();
    } catch (err) {
      console.error('Avatar delete error:', err);
      alert('Failed to delete avatar from Cloudinary.');
    }
  };

  // Loading skeleton during auth check
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-3 text-primary font-mono text-sm">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Verifying Admin Authorization...</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // LOGIN / AUTH GATE
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col items-center justify-center p-3 sm:p-4 text-foreground relative overflow-hidden select-none">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-80 h-72 sm:h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-[360px] p-4 sm:p-5 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-xl space-y-3 mx-auto">
          {/* Gate Header */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-[10px] font-mono tracking-widest uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Owner Access</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Portfolio Studio
            </h1>
            <p className="text-[11px] font-mono text-muted-foreground">
              {authMode === 'login'
                ? isHardwareEnrolled
                  ? 'Verify with Passkey / Biometrics or enter PIN'
                  : 'Enter 4-Digit Security PIN or Verify with Passkey'
                : `Verify 6-digit OTP sent to ${adminEmail}`}
            </p>
          </div>

          {authError && (
            <div className="p-2.5 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-mono text-center flex items-center justify-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Mode 1: Passkey & 4-Digit PIN Authentication */}
          {authMode === 'login' && !useFullPasskey && (
            <div className="space-y-2.5">
              {/* Primary Biometric / Passkey Action */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleBiometricAuth(false)}
                  disabled={isVerifyingPin || biometricState === 'scanning'}
                  className={`w-full py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer select-none active:scale-[0.98] border font-mono text-xs font-medium ${
                    biometricState === 'scanning'
                      ? 'border-primary bg-primary/20 text-primary shadow-[0_0_20px_rgba(99,102,241,0.35)] animate-pulse'
                      : biometricState === 'granted'
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                      : 'border-primary/30 bg-primary/10 hover:bg-primary/20 hover:border-primary text-primary shadow-xs'
                  }`}
                  title="Authenticate with Passkey / Biometrics"
                  aria-label="Authenticate with Passkey / Biometrics"
                >
                  {biometricState === 'granted' ? (
                    <>
                      <Unlock className="w-4 h-4 text-emerald-400 animate-in zoom-in duration-200" />
                      <span className="text-emerald-400 font-bold">Access Granted</span>
                    </>
                  ) : biometricState === 'scanning' ? (
                    <>
                      <Fingerprint className="w-4 h-4 text-primary animate-pulse" />
                      <span className="truncate">{biometricStatusText}</span>
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4 text-primary" />
                      <span>{isHardwareEnrolled ? 'Verify Passkey / Touch ID' : 'Verify Biometrics / Passkey'}</span>
                    </>
                  )}
                </button>

                {hasHardwareBiometrics && !isHardwareEnrolled && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleHardwareBiometricEnroll}
                      className="text-[10px] font-mono text-primary/80 hover:text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Fingerprint className="w-3 h-3 text-primary" />
                      <span>Setup Passkey (Windows Hello / Touch ID)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center py-0.5">
                <div className="border-t border-border w-full" />
                <span className="bg-card px-2 text-[9px] font-mono text-muted-foreground uppercase tracking-widest shrink-0">
                  Or 4-Digit PIN
                </span>
              </div>

              {/* PIN Header row with Mask toggle */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono px-1 text-muted-foreground">
                  <span>SECURITY PIN</span>
                  <button
                    type="button"
                    onClick={() => setMaskPin(!maskPin)}
                    className="text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    title={maskPin ? 'Reveal Digits' : 'Mask Digits'}
                  >
                    {maskPin ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{maskPin ? 'Reveal' : 'Mask'}</span>
                  </button>
                </div>

                {/* 4 PIN Boxes */}
                <div
                  className={`flex items-center justify-center gap-2.5 py-0.5 ${
                    pinShaking ? 'animate-pin-shake' : ''
                  }`}
                >
                  {pinDigits.map((digit, idx) => (
                    <div key={idx} className="relative">
                      <input
                        ref={pinInputRefs[idx]}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handlePinChange(idx, e.target.value)}
                        onKeyDown={(e) => handlePinKeyDown(idx, e)}
                        onPaste={handlePinPaste}
                        className={`w-11 h-12 rounded-xl text-center text-xl font-bold font-mono transition-all outline-none border ${
                          digit
                            ? 'bg-primary/10 border-primary text-primary shadow-[0_0_12px_rgba(99,102,241,0.3)] ring-1 ring-primary/40'
                            : 'bg-surface/80 border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary/40'
                        }`}
                      />
                      {maskPin && digit && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.9)] animate-in zoom-in-50 duration-150" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Compact Responsive Numeric Keypad */}
              <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                {[
                  { num: '1' },
                  { num: '2' },
                  { num: '3' },
                  { num: '4' },
                  { num: '5' },
                  { num: '6' },
                  { num: '7' },
                  { num: '8' },
                  { num: '9' },
                ].map((k) => (
                  <button
                    key={k.num}
                    type="button"
                    onClick={() => handleKeypadPress(k.num)}
                    className="h-8.5 rounded-lg bg-surface/80 hover:bg-surface-elevated border border-border hover:border-primary/40 text-foreground flex items-center justify-center transition-all active:scale-95 cursor-pointer text-sm font-bold font-mono shadow-xs"
                  >
                    {k.num}
                  </button>
                ))}

                {/* Clear PIN */}
                <button
                  type="button"
                  onClick={() => {
                    setPinDigits(['', '', '', '']);
                    setAuthError('');
                    pinInputRefs[0]?.current?.focus();
                  }}
                  className="h-8.5 rounded-lg bg-surface/80 hover:bg-surface-elevated border border-border hover:border-destructive/40 text-muted-foreground hover:text-destructive flex items-center justify-center transition-all active:scale-95 cursor-pointer text-[10px] font-mono font-semibold"
                  title="Clear PIN"
                >
                  CLR
                </button>

                {/* 0 Key */}
                <button
                  type="button"
                  onClick={() => handleKeypadPress('0')}
                  className="h-8.5 rounded-lg bg-surface/80 hover:bg-surface-elevated border border-border hover:border-primary/40 text-foreground flex items-center justify-center transition-all active:scale-95 cursor-pointer text-sm font-bold font-mono shadow-xs"
                >
                  0
                </button>

                {/* Backspace Key */}
                <button
                  type="button"
                  onClick={handleKeypadBackspace}
                  className="h-8.5 rounded-lg bg-surface/80 hover:bg-surface-elevated border border-border hover:border-destructive/40 text-muted-foreground hover:text-foreground flex items-center justify-center transition-all active:scale-95 cursor-pointer text-sm font-mono shadow-xs"
                  title="Delete Digit"
                >
                  ⌫
                </button>
              </div>

              {/* Secondary links */}
              <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('email_otp');
                    setAuthError('');
                  }}
                  className="text-primary hover:underline cursor-pointer"
                >
                  Forgot PIN? Reset via OTP →
                </button>

                <button
                  type="button"
                  onClick={() => setUseFullPasskey(true)}
                  className="hover:text-foreground underline cursor-pointer"
                >
                  Use Passkey Text
                </button>
              </div>
            </div>
          )}

          {/* Mode 1 Alternative: Alphanumeric Passkey fallback */}
          {authMode === 'login' && useFullPasskey && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground">Admin Passcode</label>
                <div className="relative">
                  <input
                    type={showPasscode ? 'text' : 'password'}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter passkey..."
                    autoFocus
                    className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm font-mono focus:outline-none focus:border-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/20 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock Control Studio</span>
              </button>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setUseFullPasskey(false)}
                  className="text-primary hover:underline cursor-pointer"
                >
                  ← Back to 4-Digit PIN &amp; Biometrics
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('email_otp');
                    setAuthError('');
                  }}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Reset via OTP
                </button>
              </div>
            </form>
          )}

          {/* Mode 2: Email OTP Reset with 6-Digit Boxes */}
          {authMode === 'email_otp' && (
            <div className="space-y-4 text-left">
              <div className="p-3 rounded-xl bg-surface-elevated/50 border border-border text-xs font-mono space-y-2">
                <div className="text-muted-foreground">Target Recipient:</div>
                <div className="font-bold text-foreground truncate">{adminEmail}</div>
                <button
                  type="button"
                  disabled={sendingOtp || otpCooldown > 0}
                  onClick={handleSendEmailOtp}
                  className="w-full mt-2 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary font-bold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {sendingOtp
                    ? 'Dispatching OTP...'
                    : otpCooldown > 0
                    ? `Resend available in ${otpCooldown}s`
                    : 'Send 6-Digit OTP Email'}
                </button>
              </div>

              {otpSentNotice && (
                <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono">
                  {otpSentNotice}
                </div>
              )}

              {devOtpHint && (
                <div className="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-mono flex items-center justify-between">
                  <span>
                    <strong>Simulated OTP:</strong> {devOtpHint}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const hintChars = devOtpHint.split('').slice(0, 6);
                      setOtpBoxes(hintChars);
                      setOtpCode(devOtpHint);
                    }}
                    className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[10px] cursor-pointer"
                  >
                    Auto-fill
                  </button>
                </div>
              )}

              <form onSubmit={handleVerifyEmailOtp} className="space-y-3">
                <div>
                  <label className="text-[11px] font-mono text-muted-foreground block mb-1 text-center">
                    ENTER 6-DIGIT VERIFICATION CODE
                  </label>
                  {/* 6 OTP Boxes */}
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 my-2">
                    {otpBoxes.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpInputRefs[idx]}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpBoxKeyDown(idx, e)}
                        onPaste={handleOtpBoxPaste}
                        className={`w-9 h-11 sm:w-11 sm:h-13 rounded-xl text-center text-lg sm:text-xl font-bold font-mono transition-all outline-none border ${
                          digit
                            ? 'bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(99,102,241,0.25)] ring-2 ring-primary/40'
                            : 'bg-surface/80 border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <input
                    type="password"
                    value={otpNewPasscode}
                    onChange={(e) => setOtpNewPasscode(e.target.value)}
                    placeholder="New 4-Digit PIN or Passcode"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                  />
                  <input
                    type="password"
                    value={otpConfirmPasscode}
                    onChange={(e) => setOtpConfirmPasscode(e.target.value)}
                    placeholder="Confirm New PIN / Passcode"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-mono focus:outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-mono font-bold text-xs transition-all shadow-md shadow-primary/20 cursor-pointer"
                >
                  Verify &amp; Unlock Panel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError('');
                  }}
                  className="w-full py-1 text-center text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  ← Back to PIN / Fingerprint Login
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    if (projectFilter === 'published') return p.status === 'published';
    if (projectFilter === 'draft') return p.status === 'draft';
    if (projectFilter === 'archived') return p.status === 'archived';
    if (!projectSearch.trim()) return true;
    const term = projectSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.slug.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.technologies?.some((t) => t.toLowerCase().includes(term))
    );
  });

  // =========================================================================
  // AUTHENTICATED SAAS-GRADE DASHBOARD
  // =========================================================================
  return (
    <div className="h-[calc(100vh-4rem)] bg-background text-foreground flex flex-col overflow-hidden">
      {/* Top SaaS Header - 100% Fixed at Top */}
      <header className="shrink-0 border-b border-border bg-card/95 backdrop-blur-md px-3 sm:px-8 py-3 flex items-center justify-between shadow-xs z-30">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Sidebar Collapse Toggle */}
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar (Icons Only)"}
            aria-label="Toggle Sidebar"
          >
            {sidebarCollapsed ? <PanelLeft className="w-4 h-4 text-primary" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-foreground text-sm hover:text-primary transition-colors shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-mono font-black text-xs shrink-0">
              RR
            </div>
            <span className="hidden sm:inline">Rahul Raj — Portfolio Studio</span>
          </Link>

          {/* Real-time Online Badge */}
          <button
            onClick={() => setActiveTab('live')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono hover:bg-emerald-500/20 transition-colors whitespace-nowrap shrink-0"
            title="View Live Online Visitors"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold text-[11px] sm:text-xs">{onlineCount} Online</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {saveStatus && (
            <span className="text-[11px] font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 animate-in fade-in hidden sm:inline">
              {saveStatus}
            </span>
          )}

          <button
            onClick={() => {
              setSelectedProjectForModal(null);
              setIsProjectModalOpen(true);
            }}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md shadow-primary/20 whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xs:inline">+ Add Project</span>
            <span className="xs:hidden">Add</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-xs font-mono text-foreground transition-colors shrink-0"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-surface hover:bg-muted border border-border text-muted-foreground hover:text-destructive transition-colors shrink-0"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main SaaS Layout: Fixed Sidebar + Scrollable Viewport */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 gap-4 sm:gap-6 overflow-hidden min-h-0">
        {/* Mobile Horizontal Tabs Navigation Bar */}
        <div className="md:hidden shrink-0 flex overflow-x-auto mobile-scroll-x gap-1.5 p-1.5 bg-surface border border-border rounded-2xl shadow-xs scroll-smooth overscroll-contain select-none mb-2 w-full">
          {[
            { id: 'overview', label: 'Overview & KPIs', shortLabel: 'Overview', icon: Layers },
            { id: 'projects', label: 'Projects Manager', shortLabel: 'Projects', icon: FolderKanban, badge: projects.length },
            { id: 'skills', label: 'Skills Catalog', shortLabel: 'Skills', icon: Code2, badge: skills.length },
            { id: 'live', label: 'Live Visitors', shortLabel: 'Live', icon: Activity, live: true },
            { id: 'analytics', label: 'Analytics & Charts', shortLabel: 'Analytics', icon: BarChart3 },
            { id: 'messages', label: 'Contact Inquiries', shortLabel: 'Inquiries', icon: Mail, badge: unreadMessagesCount },
            { id: 'resumes', label: 'Resumes & Cloudinary', shortLabel: 'Resumes', icon: FileText, badge: resumes.length },
            { id: 'education', label: 'Education & Scores', shortLabel: 'Education', icon: GraduationCap, badge: educations.length },
            { id: 'achievements', label: 'Achievements & Honors', shortLabel: 'Achievements', icon: Award, badge: achievements.length },
            { id: 'experience', label: 'Experience History', shortLabel: 'Experience', icon: Briefcase, badge: experiences.length },
            { id: 'settings', label: 'Portfolio Settings', shortLabel: 'Settings', icon: Settings },
            { id: 'security', label: 'Security & Passkey', shortLabel: 'Security', icon: KeyRound },
            { id: 'audit', label: 'Audit Log', shortLabel: 'Audit', icon: Clock },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-elevated'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.shortLabel}</span>
                {item.live && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                )}
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold shrink-0 ${
                    isActive ? 'bg-black/20 text-white' : 'bg-surface-elevated text-muted-foreground'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          {/* Spacer */}
          <div className="shrink-0 w-4 h-1 pointer-events-none" aria-hidden="true" />
        </div>

        {/* Desktop Navigation Sidebar - 100% Fixed on Left with Smooth Collapse */}
        <aside
          className={`hidden md:flex flex-col shrink-0 h-full overflow-y-auto overscroll-contain select-none transition-all duration-300 ease-in-out font-mono text-xs ${
            sidebarCollapsed ? 'w-16 items-center px-1' : 'w-60 pr-1 space-y-1'
          }`}
        >
          {sidebarCollapsed ? (
            <div className="w-full flex flex-col items-center py-1">
              <button
                type="button"
                onClick={() => setSidebarCollapsed(false)}
                className="w-10 h-8 flex items-center justify-center rounded-xl bg-surface/80 hover:bg-surface-elevated border border-border/80 text-muted-foreground hover:text-primary transition-all cursor-pointer shadow-2xs"
                title="Expand Sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
              <div className="w-8 border-t border-border/60 my-2" />
            </div>
          ) : (
            <div className="flex items-center justify-between px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              <span>System Operations</span>
              <button
                type="button"
                onClick={() => setSidebarCollapsed(true)}
                className="p-1 rounded-lg hover:bg-surface-elevated text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Collapse Sidebar (Icons Only)"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {[
            { id: 'overview', label: 'Overview & KPIs', icon: Layers },
            { id: 'projects', label: 'Projects Manager', icon: FolderKanban, badge: projects.length },
            { id: 'skills', label: 'Skills Catalog', icon: Code2, badge: skills.length },
            { id: 'live', label: 'Live Visitors', icon: Activity, live: true },
            { id: 'analytics', label: 'Analytics & Charts', icon: BarChart3 },
            { id: 'messages', label: 'Contact Inquiries', icon: Mail, badge: unreadMessagesCount },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as typeof activeTab)}
                title={item.label}
                className={`relative transition-all cursor-pointer ${
                  sidebarCollapsed
                    ? `w-11 h-11 flex items-center justify-center rounded-xl my-0.5 ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                      }`
                    : `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl ${
                        isActive
                          ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                          : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                      }`
                }`}
              >
                {sidebarCollapsed ? (
                  <>
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.live && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse ring-2 ring-background" />
                    )}
                    {item.badge !== undefined && item.badge > 0 && !item.live && (
                      <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center ring-2 ring-background">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.live && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    )}
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-bold shrink-0 ${
                          isActive ? 'bg-black/20 text-white' : 'bg-surface-elevated text-muted-foreground'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}

          {sidebarCollapsed ? (
            <div className="w-8 border-t border-border/60 my-2" />
          ) : (
            <div className="pt-4 px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              Resume &amp; Content
            </div>
          )}

          {[
            { id: 'resumes', label: 'Resumes & Cloudinary', icon: FileText, badge: resumes.length },
            { id: 'education', label: 'Education & Scores', icon: GraduationCap, badge: educations.length },
            { id: 'achievements', label: 'Achievements & Honors', icon: Award, badge: achievements.length },
            { id: 'experience', label: 'Experience History', icon: Briefcase, badge: experiences.length },
            { id: 'settings', label: 'Portfolio Settings', icon: Settings },
            { id: 'security', label: 'Security & Passkey', icon: KeyRound },
            { id: 'audit', label: 'Audit Log', icon: Clock },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as typeof activeTab)}
                title={item.label}
                className={`relative transition-all cursor-pointer ${
                  sidebarCollapsed
                    ? `w-11 h-11 flex items-center justify-center rounded-xl my-0.5 ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                      }`
                    : `w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl ${
                        isActive
                          ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                          : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                      }`
                }`}
              >
                {sidebarCollapsed ? (
                  <>
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center ring-2 ring-background">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className={`ml-auto text-[10px] px-1.5 py-0.2 rounded font-bold shrink-0 ${
                          isActive ? 'bg-black/20 text-white' : 'bg-surface-elevated text-muted-foreground'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </aside>

        {/* Viewport Content - Independently Scrollable Right Pane */}
        <main className="flex-1 h-full overflow-y-auto overscroll-contain min-w-0 pr-1 pb-16 space-y-6">
          {/* ====================================================
              TAB: OVERVIEW
              ==================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Top Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>SaaS Portfolio Control Center</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    Welcome back, Rahul
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                    Manage your production projects, master skills catalog, and monitor real-time visitor telemetry in one unified internal studio.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedProjectForModal(null);
                      setIsProjectModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-md shadow-primary/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Project</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="px-4 py-2.5 rounded-xl bg-surface hover:bg-muted border border-border text-xs font-mono text-foreground flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Settings className="w-4 h-4 text-primary" />
                    <span>Edit Profile &amp; DP</span>
                  </button>
                </div>
              </div>

              {/* Quick KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-card border border-border space-y-1 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span>Live Online</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                    {onlineCount}
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground">Active in last 45s</div>
                </div>

                <div className="p-5 rounded-2xl bg-card border border-border space-y-1 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span>Published Projects</span>
                    <FolderKanban className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-foreground">
                    {projects.filter((p) => p.status === 'published').length}
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground">
                    {projects.filter((p) => p.status === 'draft').length} drafts in progress
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-card border border-border space-y-1 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span>Master Skills</span>
                    <Code2 className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">
                    {skills.length}
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground">Reusable stack items</div>
                </div>

                <div className="p-5 rounded-2xl bg-card border border-border space-y-1 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span>Contact Inquiries</span>
                    <Mail className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-purple-400">
                    {unreadMessagesCount}
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground">
                    Unread transmissions
                  </div>
                </div>
              </div>

              {/* Projects Quick Preview */}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-foreground font-bold">
                    Active Projects Catalog ({projects.length})
                  </h3>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="text-xs font-mono text-primary hover:underline"
                  >
                    View All in Manager →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.slice(0, 6).map((p) => (
                    <div
                      key={p.slug}
                      className="p-4 rounded-2xl bg-card border border-border flex flex-col justify-between space-y-3 shadow-sm hover:border-border-accent transition-all group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono text-primary font-bold">{p.category}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                              p.status === 'published'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-foreground mt-1">{p.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{p.tagline}</p>
                      </div>

                      <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-mono">
                        <button
                          onClick={() => {
                            setSelectedProjectForModal(p);
                            setIsProjectModalOpen(true);
                          }}
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <a
                          href={`/work/${p.slug}?preview=true`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                          <span>Preview</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              TAB: PROJECTS MANAGER (FULL CRUD + REORDERING)
              ==================================================== */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Action Toolbar */}
              <div className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                {/* Status filter pills */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                  {[
                    { id: 'all', label: `All (${projects.length})` },
                    { id: 'published', label: `Published (${projects.filter((p) => p.status === 'published').length})` },
                    { id: 'draft', label: `Drafts (${projects.filter((p) => p.status === 'draft').length})` },
                    { id: 'archived', label: `Archived (${projects.filter((p) => p.status === 'archived').length})` },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setProjectFilter(f.id as typeof projectFilter)}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        projectFilter === f.id
                          ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                          : 'bg-surface text-muted-foreground hover:text-foreground border border-border'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Search & Add */}
                <div className="flex items-center gap-2">
                  {loadingProjects && (
                    <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin" />
                  )}
                  <div className="relative">
                    <SearchIcon className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-foreground" />
                    <input
                      type="text"
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      placeholder="Filter projects..."
                      className="pl-9 pr-3.5 py-1.5 rounded-xl bg-surface border border-border text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProjectForModal(null);
                      setIsProjectModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-mono font-bold flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Project</span>
                  </button>
                </div>
              </div>

              {/* Projects List with Reordering */}
              <div className="space-y-3">
                {filteredProjects.length === 0 ? (
                  <div className="p-12 text-center bg-card border border-border rounded-2xl space-y-2 text-xs font-mono text-muted-foreground">
                    <p>No projects match your current filter.</p>
                    <button
                      onClick={() => {
                        setSelectedProjectForModal(null);
                        setIsProjectModalOpen(true);
                      }}
                      className="text-primary hover:underline"
                    >
                      + Create a new project →
                    </button>
                  </div>
                ) : (
                  filteredProjects.map((p, idx) => (
                    <div
                      key={p.slug}
                      className="p-4 sm:p-5 rounded-2xl bg-card border border-border hover:border-border-accent flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-sm"
                    >
                      {/* Left info */}
                      <div className="flex items-start gap-4">
                        {/* Up/Down order controls */}
                        <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                          <button
                            onClick={() => handleMoveProject(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-20"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[10px] font-mono text-muted-foreground font-bold">
                            #{p.sortOrder ?? idx + 1}
                          </span>
                          <button
                            onClick={() => handleMoveProject(idx, 'down')}
                            disabled={idx === filteredProjects.length - 1}
                            className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-20"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Thumbnail or placeholder */}
                        <div className="w-16 h-12 rounded-xl bg-surface border border-border overflow-hidden shrink-0 flex items-center justify-center">
                          {p.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <FolderKanban className="w-5 h-5 text-muted-foreground/50" />
                          )}
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-base font-bold text-foreground truncate">{p.name}</h4>
                            <span className="text-xs font-mono text-muted-foreground">/work/{p.slug}</span>

                            <button
                              onClick={() => handleToggleFeatured(p)}
                              className={`p-1 rounded-md transition-colors ${
                                p.featured ? 'text-amber-400' : 'text-muted-foreground/40 hover:text-muted-foreground'
                              }`}
                              title={p.featured ? 'Featured on homepage' : 'Mark as featured'}
                            >
                              <Star className={`w-3.5 h-3.5 ${p.featured ? 'fill-current' : ''}`} />
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
                            <span>Tier {p.tier}</span>
                            <span>•</span>
                            <span>{p.category}</span>
                            <span>•</span>
                            <span>{p.year}</span>
                            {p.technologies && p.technologies.length > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-foreground font-semibold truncate max-w-xs">
                                  {p.technologies.slice(0, 4).join(', ')}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                        {/* Status selector */}
                        <select
                          value={p.status || 'published'}
                          onChange={(e) =>
                            handleToggleProjectStatus(p, e.target.value as 'published' | 'draft' | 'archived')
                          }
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase border ${
                            p.status === 'published'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : p.status === 'draft'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              : 'bg-muted border-border text-muted-foreground'
                          }`}
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>

                        <a
                          href={`/work/${p.slug}?preview=true`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-surface hover:bg-muted border border-border text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1"
                          title="Preview case study"
                        >
                          <Eye className="w-3.5 h-3.5 text-primary" />
                          <span className="hidden sm:inline">Preview</span>
                        </a>

                        <button
                          onClick={() => {
                            setSelectedProjectForModal(p);
                            setIsProjectModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-xs font-mono text-primary font-bold flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProject(p)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ====================================================
              TAB: REUSABLE SKILLS CATALOG
              ==================================================== */}
          {activeTab === 'skills' && (
            <SkillsView skills={skills} onRefresh={fetchAllAdminData} />
          )}

          {/* ====================================================
              TAB: LIVE VISITORS (REALTIME PRESENCE)
              ==================================================== */}
          {activeTab === 'live' && <LiveVisitorsView />}

          {/* ====================================================
              TAB: ANALYTICS & CHARTS
              ==================================================== */}
          {activeTab === 'analytics' && <AnalyticsDashboard />}

          {/* ====================================================
              TAB: CONTACT INQUIRIES & MESSAGES
              ==================================================== */}
          {activeTab === 'messages' && (
            <MessagesView onCountChange={(c) => setUnreadMessagesCount(c.unread)} />
          )}

          {/* ====================================================
              TAB: RESUMES & CLOUDINARY
              ==================================================== */}
          {activeTab === 'resumes' && (
            <ResumesView resumes={resumes} onRefresh={fetchPortfolioData} />
          )}

          {/* ====================================================
              TAB: EDUCATION & ACADEMIC CREDENTIALS
              ==================================================== */}
          {activeTab === 'education' && (
            <EducationView educations={educations} onRefresh={fetchPortfolioData} />
          )}

          {/* ====================================================
              TAB: ACHIEVEMENTS & CERTIFICATIONS
              ==================================================== */}
          {activeTab === 'achievements' && (
            <AchievementsView achievements={achievements} onRefresh={fetchPortfolioData} />
          )}

          {/* ====================================================
              TAB: SETTINGS (PERSONAL INFO & PROFILE AVATAR)
              ==================================================== */}
          {activeTab === 'settings' && (
            <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-sm animate-in fade-in duration-150">
              <div>
                <h3 className="text-base font-bold font-mono text-foreground flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" />
                  <span>Portfolio Global Settings &amp; Personal Info</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Customize your avatar picture, headline, bio, availability status, and social links.
                </p>
              </div>

              {/* Profile Avatar / DP Cloudinary Synchronization */}
              <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-foreground text-sm">Profile Avatar &amp; Display Picture (DP)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Real-Time Cloudinary &amp; DB Sync</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Avatar Preview */}
                  <div className="relative group shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-purple-500/40 bg-slate-900 shadow-lg relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={avatarPreview || personalInfo.avatarUrl || '/assets/rahul.jpg'}
                        alt="Profile Avatar Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/rahul.jpg';
                        }}
                      />
                    </div>
                    {avatarPreview && (
                      <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-bold shadow">
                        New
                      </span>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 w-full space-y-3 text-xs font-mono">
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Upload your profile photo. It is automatically optimized and stored in Cloudinary and synchronized directly with your portfolio Hero section and metadata.
                    </p>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-muted border border-border text-foreground transition-colors flex items-center gap-2">
                        <Upload className="w-3.5 h-3.5 text-primary" />
                        <span className="truncate max-w-[180px]">{avatarFile ? avatarFile.name : 'Choose Image File...'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSelectAvatar}
                          className="hidden"
                        />
                      </label>

                      {avatarFile && (
                        <button
                          type="button"
                          onClick={handleUploadAvatar}
                          disabled={uploadingAvatar}
                          className="px-4 py-2 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-bold flex items-center gap-1.5 shadow-md shadow-primary/20 disabled:opacity-50"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingAvatar ? 'Uploading to Cloudinary...' : 'Upload & Sync'}</span>
                        </button>
                      )}

                      {personalInfo.avatarUrl && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="px-3.5 py-2 rounded-xl bg-surface hover:bg-destructive/15 text-muted-foreground hover:text-destructive border border-border hover:border-destructive/30 transition-colors text-[11px] flex items-center gap-1.5"
                          title="Remove custom avatar from Cloudinary and reset to local /assets/rahul.jpg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Avatar from Cloudinary</span>
                        </button>
                      )}
                    </div>

                    {/* Direct URL input */}
                    <div className="space-y-1 pt-1">
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Current Avatar URL (or External Image Link)
                      </label>
                      <input
                        type="text"
                        value={personalInfo.avatarUrl || ''}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, avatarUrl: e.target.value })}
                        placeholder="https://res.cloudinary.com/... or /assets/rahul.jpg"
                        className="w-full px-3 py-1.5 rounded-xl bg-surface border border-border text-[11px] text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cloudinary CDN Cloud Connection Card */}
              <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-sky-400" />
                    <div>
                      <h4 className="font-bold text-foreground text-sm">Cloudinary CDN Integration &amp; Cloud Storage</h4>
                      <p className="text-[11px] text-muted-foreground">Real-time cloud asset storage for high-res DPs &amp; multi-profile resume PDFs</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full border ${
                    cloudConnected
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <span>{cloudConnected ? 'CDN Connected' : 'Local Fallback Active'}</span>
                  </div>
                </div>

                <form onSubmit={handleSaveCloudinary} className="space-y-3 text-xs font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Cloud Name</label>
                      <input
                        type="text"
                        value={cloudName}
                        onChange={(e) => setCloudName(e.target.value)}
                        placeholder="e.g. dxyz1234"
                        className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">API Key</label>
                      <input
                        type="text"
                        value={cloudApiKey}
                        onChange={(e) => setCloudApiKey(e.target.value)}
                        placeholder="e.g. 123456789012345"
                        className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">API Secret</label>
                      <input
                        type="password"
                        value={cloudApiSecret}
                        onChange={(e) => setCloudApiSecret(e.target.value)}
                        placeholder="••••••••••••••••"
                        className="w-full px-3 py-2 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <p className="text-[11px] text-muted-foreground/80">
                      Credentials persist in MongoDB Atlas. Environment variables (<code className="text-primary text-[10px]">.env.local</code>) are also automatically loaded if provided.
                    </p>
                    <button
                      type="submit"
                      disabled={testingCloud}
                      className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold flex items-center gap-1.5 shadow-md shadow-sky-500/20 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      <Cloud className="w-3.5 h-3.5" />
                      <span>{testingCloud ? 'Verifying CDN...' : 'Save & Verify Connection'}</span>
                    </button>
                  </div>

                  {cloudStatus && (
                    <div className="p-2.5 rounded-xl bg-surface-elevated border border-border/80 text-[11px] flex items-center gap-2 text-foreground">
                      <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{cloudStatus}</span>
                    </div>
                  )}
                </form>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Role Title</label>
                  <input
                    type="text"
                    value={personalInfo.role}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-muted-foreground">Hero Tagline</label>
                  <input
                    type="text"
                    value={personalInfo.tagline}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-muted-foreground">Bio / Narrative</label>
                  <textarea
                    rows={3}
                    value={personalInfo.bio}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm leading-relaxed focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Contact Email</label>
                  <input
                    type="text"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">GitHub URL</label>
                  <input
                    type="text"
                    value={personalInfo.github}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">LinkedIn URL</label>
                  <input
                    type="text"
                    value={personalInfo.linkedin || ''}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Twitter / X URL</label>
                  <input
                    type="text"
                    value={personalInfo.twitter || ''}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, twitter: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Instagram URL</label>
                  <input
                    type="text"
                    value={personalInfo.instagram || ''}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, instagram: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">LeetCode URL</label>
                  <input
                    type="text"
                    value={personalInfo.leetcode || ''}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, leetcode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Codeforces URL</label>
                  <input
                    type="text"
                    value={personalInfo.codeforces || ''}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, codeforces: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Location</label>
                  <input
                    type="text"
                    value={personalInfo.location}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground">Resume PDF URL (Optional override)</label>
                  <input
                    type="text"
                    value={personalInfo.resumeUrl || ''}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, resumeUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                  <input
                    type="checkbox"
                    checked={personalInfo.available}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, available: e.target.checked })}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span>Available for Engineering Roles / Select Contracts</span>
                </label>

                <button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground text-xs font-mono font-bold flex items-center gap-2 shadow-md shadow-primary/20 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{loading ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ====================================================
              TAB: EXPERIENCE HISTORY
              ==================================================== */}
          {activeTab === 'experience' && (
            <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-mono text-foreground flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span>Work Experience ({experiences.length})</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">Engineering roles, companies, and achievements.</p>
                </div>
              </div>

              <div className="space-y-4">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-surface border border-border space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground text-sm">{exp.role} @ {exp.company}</span>
                      <span className="text-muted-foreground">{exp.duration}</span>
                    </div>
                    <p className="text-muted-foreground">{exp.description}</p>
                    {exp.technologies && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {exp.technologies.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded bg-surface-elevated text-[10px] text-primary">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* ====================================================
              TAB: SECURITY & PASSKEY
              ==================================================== */}
          {activeTab === 'security' && (
            <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-sm">
              <div>
                <h3 className="text-base font-bold font-mono text-foreground flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-primary" />
                  <span>Security, Passkey &amp; Access Control</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Update your active admin passkey or configure email OTP recovery.
                </p>
              </div>

              {securityMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-mono ${
                    securityMsg.type === 'success'
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                      : 'bg-destructive/15 border border-destructive/30 text-destructive'
                  }`}
                >
                  {securityMsg.text}
                </div>
              )}

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (newPasscode !== confirmPasscode) {
                    setSecurityMsg({ type: 'error', text: 'New passcodes do not match.' });
                    return;
                  }
                  setIsUpdatingPasscode(true);
                  try {
                    const res = await fetch('/api/admin/auth', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        action: 'change_passcode',
                        currentPasscode,
                        newPasscode,
                      }),
                    });
                    const data = await res.json();
                    if (res.ok && data.success) {
                      setSecurityMsg({ type: 'success', text: data.message });
                      setCurrentPasscode('');
                      setNewPasscode('');
                      setConfirmPasscode('');
                    } else {
                      setSecurityMsg({ type: 'error', text: data.error || 'Failed to update passcode.' });
                    }
                  } catch {
                    setSecurityMsg({ type: 'error', text: 'Request failed.' });
                  } finally {
                    setIsUpdatingPasscode(false);
                  }
                }}
                className="max-w-md space-y-4 text-xs font-mono"
              >
                <div className="space-y-1">
                  <label className="text-muted-foreground">Current Passcode</label>
                  <input
                    type="password"
                    value={currentPasscode}
                    onChange={(e) => setCurrentPasscode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-muted-foreground">New Passcode</label>
                  <input
                    type="password"
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-muted-foreground">Confirm New Passcode</label>
                  <input
                    type="password"
                    value={confirmPasscode}
                    onChange={(e) => setConfirmPasscode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingPasscode}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-bold disabled:opacity-50"
                >
                  {isUpdatingPasscode ? 'Updating...' : 'Update Passcode'}
                </button>
              </form>

              {/* Passkey & WebAuthn Biometrics Section */}
              <div className="pt-6 border-t border-border space-y-3">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-bold font-mono text-foreground">
                    Passkey &amp; Biometric Authentication (WebAuthn)
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  Authenticate passwordlessly using your device&apos;s platform authenticator (Windows Hello, Touch ID, or Android Biometrics). Once registered, authenticating with your sensor unlocks the Admin Studio instantly.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleHardwareBiometricEnroll}
                    className="px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Fingerprint className="w-4 h-4 text-primary" />
                    <span>{isHardwareEnrolled ? 'Re-register Device Passkey' : 'Register Passkey on this Device'}</span>
                  </button>

                  {isHardwareEnrolled && (
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Passkey Active on this Device</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              TAB: AUDIT LOG
              ==================================================== */}
          {activeTab === 'audit' && (
            <div className="p-6 rounded-3xl bg-card border border-border space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-mono text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Administrative Audit Trail ({auditLogs.length})</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Historical record of project additions, edits, deletions, and settings mutations.
                  </p>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-surface-elevated border-b border-border text-muted-foreground uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Resource</th>
                      <th className="py-3 px-4">Details</th>
                      <th className="py-3 px-4 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-muted-foreground">
                          No audit logs recorded yet. Mutations will be logged here.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map((log, idx) => (
                        <tr key={idx} className="hover:bg-card/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-foreground capitalize">
                            {log.action.replace('_', ' ')}
                          </td>
                          <td className="py-3 px-4 text-primary">{log.resource}</td>
                          <td className="py-3 px-4 text-muted-foreground truncate max-w-xs">
                            {JSON.stringify(log.details || {})}
                          </td>
                          <td className="py-3 px-4 text-right text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Project Studio Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        project={selectedProjectForModal}
        skillsList={skills}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProjectFromModal}
      />
    </div>
  );
}
