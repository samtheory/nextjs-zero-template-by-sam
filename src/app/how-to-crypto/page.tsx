"use client";

import Link from "next/link";
import { useState } from "react";
import { encryption, hashService } from "@/core/crypto";

export default function HowToCrypto() {
  // Encryption state
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [exportedKey, setExportedKey] = useState<string>("");
  const [plaintext, setPlaintext] = useState("Hello, secret message!");
  const [ciphertext, setCiphertext] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [encStatus, setEncStatus] = useState<string>("");

  // Hash state
  const [hashInput, setHashInput] = useState("my password");
  const [hashResult, setHashResult] = useState<{ hash: string; salt: string } | null>(null);
  const [verifyInput, setVerifyInput] = useState("");
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
  const [hashLoading, setHashLoading] = useState(false);

  const handleGenerateKey = async () => {
    const k = await encryption.generateKey();
    setKey(k);
    const exported = await encryption.exportKey(k);
    setExportedKey(exported);
    setCiphertext("");
    setDecrypted("");
    setEncStatus("Key generated!");
  };

  const handleEncrypt = async () => {
    if (!key) return;
    const ct = await encryption.encrypt(plaintext, key);
    setCiphertext(ct);
    setDecrypted("");
    setEncStatus("Encrypted.");
  };

  const handleDecrypt = async () => {
    if (!key || !ciphertext) return;
    const pt = await encryption.decrypt(ciphertext, key);
    setDecrypted(pt);
    setEncStatus("Decrypted.");
  };

  const handleHashPassword = async () => {
    setHashLoading(true);
    setVerifyResult(null);
    const result = await hashService.hashPassword(hashInput);
    setHashResult(result);
    setVerifyInput(hashInput);
    setHashLoading(false);
  };

  const handleVerify = async () => {
    if (!hashResult) return;
    const valid = await hashService.verifyPassword(verifyInput, hashResult.hash, hashResult.salt);
    setVerifyResult(valid);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">
        <Link href="/docs/crypto" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition mb-8 group">
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> docs / crypto
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-1">Crypto Service</h1>
        <p className="text-sm text-muted mb-10">AES-256-GCM encryption and PBKDF2 password hashing — no dependencies.</p>

        <div className="space-y-8">

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-3">1 — Encryption</p>
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-4">
              <button
                onClick={handleGenerateKey}
                className="px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition"
              >
                Generate key
              </button>

              {exportedKey && (
                <div className="p-3 rounded-xl border border-border bg-surface-raised">
                  <p className="text-xs text-muted mb-1">Exported key (base64, 32 chars shown):</p>
                  <code className="text-xs font-mono text-foreground break-all">{exportedKey.slice(0, 32)}…</code>
                </div>
              )}

              <div className="space-y-2">
                <input
                  value={plaintext}
                  onChange={(e) => setPlaintext(e.target.value)}
                  disabled={!key}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface-raised text-sm text-foreground outline-none focus:ring-2 focus:ring-primary-400 disabled:opacity-50"
                  placeholder="Plaintext to encrypt"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleEncrypt}
                    disabled={!key}
                    className="px-3 py-2 rounded-xl bg-primary-500 text-white text-xs font-semibold hover:bg-primary-600 disabled:opacity-40 transition"
                  >
                    Encrypt
                  </button>
                  <button
                    onClick={handleDecrypt}
                    disabled={!key || !ciphertext}
                    className="px-3 py-2 rounded-xl bg-secondary-500 text-white text-xs font-semibold hover:bg-secondary-600 disabled:opacity-40 transition"
                  >
                    Decrypt
                  </button>
                </div>
              </div>

              {ciphertext && (
                <div className="p-3 rounded-xl border border-border bg-surface-raised">
                  <p className="text-xs text-muted mb-1">Ciphertext:</p>
                  <code className="text-xs font-mono text-foreground break-all">{ciphertext.slice(0, 60)}…</code>
                </div>
              )}

              {decrypted && (
                <div className="p-3 rounded-xl border border-success-200 bg-success-50">
                  <p className="text-xs text-muted mb-1">Decrypted:</p>
                  <code className="text-xs font-mono text-success-700">{decrypted}</code>
                </div>
              )}

              {encStatus && <p className="text-xs text-muted">{encStatus}</p>}
            </div>
            <p className="mt-2 text-xs text-muted font-mono">encryption.generateKey() → encrypt() → decrypt()</p>
          </section>

          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-3">2 — Password hashing</p>
            <div className="p-6 rounded-2xl border border-border bg-surface space-y-4">
              <input
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface-raised text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary-400"
                placeholder="Password to hash"
              />
              <button
                onClick={handleHashPassword}
                disabled={hashLoading}
                className="px-4 py-2 rounded-xl bg-secondary-500 text-white text-sm font-semibold hover:bg-secondary-600 disabled:opacity-60 transition"
              >
                {hashLoading ? "Hashing… (PBKDF2 100k iterations)" : "Hash password"}
              </button>

              {hashResult && (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl border border-border bg-surface-raised">
                    <p className="text-xs text-muted mb-1">Hash:</p>
                    <code className="text-xs font-mono text-foreground break-all">{hashResult.hash.slice(0, 48)}…</code>
                  </div>
                  <div className="p-3 rounded-xl border border-border bg-surface-raised">
                    <p className="text-xs text-muted mb-1">Salt (store alongside hash):</p>
                    <code className="text-xs font-mono text-foreground break-all">{hashResult.salt}</code>
                  </div>

                  <div className="pt-2 space-y-2">
                    <p className="text-xs text-muted">Verify — change the value to test a wrong password:</p>
                    <input
                      value={verifyInput}
                      onChange={(e) => setVerifyInput(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-border bg-surface-raised text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary-400"
                    />
                    <button
                      onClick={handleVerify}
                      className="px-3 py-2 rounded-xl bg-accent-500 text-white text-xs font-semibold hover:bg-accent-600 transition"
                    >
                      Verify
                    </button>
                    {verifyResult !== null && (
                      <p className={`text-sm font-semibold ${verifyResult ? "text-success-600" : "text-error-500"}`}>
                        {verifyResult ? "✓ Password matches" : "✗ Password does not match"}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-muted font-mono">hashService.hashPassword(pw) → verifyPassword(pw, hash, salt)</p>
          </section>

        </div>
      </div>
    </div>
  );
}
