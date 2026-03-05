-- ============================================
-- Güvenilir Mi? — PostgreSQL Schema
-- ============================================
-- Çalıştırmak için:
--   psql -h <RDS_ENDPOINT> -U <DB_USER> -d <DB_NAME> -f schema.sql

-- UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),           -- NULL for Cognito/social users
    phone_number  VARCHAR(30),
    country       VARCHAR(100) DEFAULT 'Turkiye',
    image_url     TEXT,
    status        VARCHAR(20)  NOT NULL DEFAULT 'active',
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================
-- COMPANIES
-- ============================================
CREATE TABLE IF NOT EXISTS companies (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name          VARCHAR(255) NOT NULL,
    slug          VARCHAR(255) NOT NULL UNIQUE,
    description   TEXT,
    phone         VARCHAR(50),
    image_url     TEXT,
    status        VARCHAR(20)  NOT NULL DEFAULT 'pending',
    rating        NUMERIC(3,1),
    comment_count INT          NOT NULL DEFAULT 0,
    sectors       TEXT[]       DEFAULT '{}',
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================
-- COMMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id      UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    author_name    VARCHAR(100) NOT NULL,
    author_avatar  TEXT,
    company_id     UUID         NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    company_name   VARCHAR(255) NOT NULL,
    rating         INT          NOT NULL CHECK (rating BETWEEN 1 AND 5),
    message        TEXT         NOT NULL,
    status         VARCHAR(20)  NOT NULL DEFAULT 'pending',
    answer         TEXT,
    answer_date    TIMESTAMPTZ,
    likes_count    INT          NOT NULL DEFAULT 0,
    product_name   VARCHAR(255),
    contact_method VARCHAR(100),
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================
-- FAVOURITE COMPANIES (user ↔ company)
-- ============================================
CREATE TABLE IF NOT EXISTS favourite_companies (
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, company_id)
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text       TEXT         NOT NULL,
    type       VARCHAR(50)  NOT NULL DEFAULT 'info',
    is_read    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================
-- REWARDS
-- ============================================
CREATE TABLE IF NOT EXISTS rewards (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text       TEXT         NOT NULL,
    code       VARCHAR(100) NOT NULL UNIQUE,
    is_used    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================
-- VERIFICATIONS (company verification requests)
-- ============================================
CREATE TABLE IF NOT EXISTS verifications (
    id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id               UUID         NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    requester_name           VARCHAR(255) NOT NULL,
    requester_title          VARCHAR(255),
    requester_company_email  VARCHAR(255) NOT NULL,
    requester_phone_number   VARCHAR(50),
    panel_user_name          VARCHAR(100) NOT NULL,
    mernis_no                VARCHAR(50),
    signature_urls           TEXT[]       DEFAULT '{}',
    address                  TEXT,
    city                     VARCHAR(100),
    district                 VARCHAR(100),
    postal_code              VARCHAR(20),
    membership               VARCHAR(30)  NOT NULL DEFAULT 'free',
    status                   VARCHAR(20)  NOT NULL DEFAULT 'pending',
    rejection_reason         TEXT,
    created_at               TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================
-- Indexes (performans için)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_companies_slug    ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_status  ON companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_name    ON companies USING gin(to_tsvector('turkish', name));
CREATE INDEX IF NOT EXISTS idx_comments_company  ON comments(company_id);
CREATE INDEX IF NOT EXISTS idx_comments_author   ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_status   ON comments(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_user      ON rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_verifications_company ON verifications(company_id);
