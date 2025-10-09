# frozen_string_literal: true

# Configure cookie options for session and Devise cookies.
# - In production we want Secure and SameSite attributes set.
# - For cross-origin SPA setups (frontend on different origin) set SAME_SITE to 'None'
#   and ensure `FRONTEND_ORIGIN` and HTTPS are used. Controlled via env vars.

default_same_site = Rails.env.production? ? "none" : "lax"
same_site = ENV.fetch("SESSION_COOKIE_SAME_SITE", default_same_site).to_s.downcase
secure_flag = ENV.fetch("SESSION_COOKIE_SECURE", Rails.env.production? ? "true" : "false") == "true"

# Ensure session_options exists before merging (some boot paths may not initialize it yet)
Rails.application.config.session_options ||= {}
Rails.application.config.session_options.merge!(
  key: ENV.fetch("SESSION_COOKIE_KEY", "_backend_session"),
  secure: secure_flag,
  httponly: true,
  same_site: same_site.to_sym
)

# Also set Devise rememberable cookie options if Devise is present
if defined?(Devise)
  Devise.setup do |config|
    config.rememberable_options = {
      secure: secure_flag,
      httponly: true,
      same_site: same_site.to_sym
    }
  end
end
