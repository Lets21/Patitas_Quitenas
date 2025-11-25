export interface EmailValidationResult {
  normalized: string;
  isValid: boolean;
  error?: string;
  suggestion?: string;
}

const RFC_5322_REGEX =
  /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;

const COMMON_TLDS = new Set([
  "com",
  "org",
  "net",
  "edu",
  "info",
  "gob",
  "gov",
  "io",
  "ai",
  "app",
  "dev",
  "me",
  "co",
  "es",
  "ec",
  "pe",
  "ar",
  "cl",
  "mx",
  "us",
  "uk",
  "biz",
  "club",
  "ngo",
  "int",
  "tech",
  "store",
  "live",
  "pro",
  "email",
]);

const DISPOSABLE_DOMAINS = [
  "mailinator.com",
  "yopmail.com",
  "discard.email",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "guerrillamail.com",
  "getnada.com",
  "trashmail.com",
  "maildrop.cc",
];

const COMMON_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "icloud.com",
  "live.com",
  "protonmail.com",
  "gmx.com",
  "me.com",
  "pm.me",
  "outlook.es",
  "hotmail.es",
  "hotmail.com.ec",
];

const PROVIDER_ROOTS = [
  "gmail",
  "hotmail",
  "outlook",
  "live",
  "yahoo",
  "icloud",
  "protonmail",
  "gmx",
  "pm",
  "me",
];

const DOMAIN_TYPO_MAP: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmai.com": "gmail.com",
  "hotmai.com": "hotmail.com",
  "hotnail.com": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "outllok.com": "outlook.com",
  "yaho.com": "yahoo.com",
};

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  const lenA = a.length;
  const lenB = b.length;

  for (let i = 0; i <= lenB; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= lenA; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= lenB; i++) {
    for (let j = 1; j <= lenA; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[lenB][lenA];
}

function getDomainSuggestion(local: string, domain: string): string | undefined {
  const mapped = DOMAIN_TYPO_MAP[domain];
  if (mapped) {
    return `${local}@${mapped}`;
  }

  let bestMatch = "";
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const candidate of COMMON_DOMAINS) {
    const distance = levenshtein(domain, candidate);
    if (distance > 0 && distance <= 2 && distance < bestDistance) {
      bestDistance = distance;
      bestMatch = candidate;
    }
  }

  if (bestMatch) {
    return `${local}@${bestMatch}`;
  }

  return undefined;
}

export function validateEmail(rawEmail: string): EmailValidationResult {
  const normalized = rawEmail.trim().toLowerCase();
  if (!normalized) {
    return { normalized, isValid: false, error: "Email requerido" };
  }

  if (!RFC_5322_REGEX.test(normalized)) {
    const [local, domain = ""] = normalized.split("@");
    return {
      normalized,
      isValid: false,
      error: "Formato de correo no válido",
      suggestion: domain ? getDomainSuggestion(local, domain) : undefined,
    };
  }

  const [local, domain] = normalized.split("@");
  if (!domain) {
    return { normalized, isValid: false, error: "Formato de correo no válido" };
  }

  if (/^\d+$/.test(local)) {
    return {
      normalized,
      isValid: false,
      error: "El correo no puede contener solo números antes del @",
    };
  }

  if (/^\d+$/.test(domain.replace(/\./g, ""))) {
    return {
      normalized,
      isValid: false,
      error: "El dominio no puede ser únicamente numérico",
    };
  }

  const domainParts = domain.split(".");
  if (domainParts.length < 2) {
    return {
      normalized,
      isValid: false,
      error: "Agrega una extensión válida al correo (ej. .com)",
    };
  }

  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return {
      normalized,
      isValid: false,
      error: "La extensión del dominio debe tener al menos dos letras",
    };
  }

  const hasAlphaInLabels = domainParts
    .slice(0, -1)
    .every((label) => /[a-z]/i.test(label));
  if (!hasAlphaInLabels) {
    return {
      normalized,
      isValid: false,
      error: "El dominio debe contener letras (ej. nombre-dominio.com)",
    };
  }

  if (!COMMON_TLDS.has(tld)) {
    return {
      normalized,
      isValid: false,
      error: "Usa una extensión conocida (.com, .org, .io, .ec, ...)",
      suggestion: getDomainSuggestion(local, domain),
    };
  }

  const secondLevel = domainParts[domainParts.length - 2];
  const matchingRoot = PROVIDER_ROOTS.find((root) =>
    secondLevel.startsWith(root)
  );
  if (matchingRoot) {
    const suffix = secondLevel.slice(matchingRoot.length);
    if (suffix && /^\d+$/.test(suffix)) {
      return {
        normalized,
        isValid: false,
        error: "El dominio parece incorrecto. Verifica la ortografía (ej. gmail.com).",
        suggestion: getDomainSuggestion(local, domain),
      };
    }
  }

  if (DISPOSABLE_DOMAINS.some((blocked) => domain.endsWith(blocked))) {
    return {
      normalized,
      isValid: false,
      error: "No se permiten correos temporales (mailinator, yopmail, etc.)",
    };
  }

  const suggestion = getDomainSuggestion(local, domain);

  return {
    normalized,
    isValid: true,
    suggestion,
  };
}

