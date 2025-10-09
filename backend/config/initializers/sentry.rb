# frozen_string_literal: true

dsn = ENV["SENTRY_DSN"].presence
if dsn
  Sentry.init do |config|
    config.dsn = dsn
    config.breadcrumbs_logger = %i[active_support_logger http_logger]
    config.environment = ENV.fetch("RAILS_ENV", Rails.env)
    config.release = ENV["RELEASE_VERSION"] if ENV["RELEASE_VERSION"].present?
    # Sample rate should be tuned in production
    config.traces_sample_rate = ENV.fetch("SENTRY_TRACES_SAMPLE_RATE", 0.0).to_f
  end
elsif defined?(Rails)
  # Sentry disabled; keeps requiring the gem safe in environments without a DSN
  Rails.logger.info("Sentry not configured (SENTRY_DSN missing)")
end
