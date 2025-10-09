# frozen_string_literal: true

namespace :db do
  desc "Create a timestamped PG dump in tmp/backups (requires pg_dump to be available)"
  task backup: :environment do
    require "fileutils"

    FileUtils.mkdir_p(Rails.root.join("tmp/backups"))
    timestamp = Time.now.utc.strftime("%Y%m%d%H%M%S")
    filename = Rails.root.join("tmp/backups/db_backup_#{timestamp}.sql")

    # Prefer DATABASE_URL if present
    database_url = ENV.fetch("DATABASE_URL", nil)
    if database_url && !database_url.empty?
      cmd = "pg_dump \"#{database_url}\" -Fc -f #{filename}"
    else
      host = ENV.fetch("DB_HOST", "localhost")
      port = ENV.fetch("DB_PORT", 5432)
      db_config = Rails.configuration.database_configuration[Rails.env]
      name = ENV.fetch("DB_NAME", db_config && db_config["database"])
      user = ENV.fetch("DB_USERNAME", nil)
      pw_env = ENV.fetch("DB_PASSWORD", nil)
      env_pw = pw_env ? "PGPASSWORD='#{pw_env}' " : ""

      unless name
        puts(
          "Could not determine database name; set DATABASE_URL or DB_NAME/DB_USERNAME/DB_PASSWORD"
        )
        next
      end

      cmd = "#{env_pw}pg_dump -h #{host} -p #{port} -U #{user} -Fc -f #{filename} #{name}"
    end

    puts "Running: #{cmd}"
    system(cmd) || abort("pg_dump failed or not available")
    puts "Created backup: #{filename}"
  end
end
