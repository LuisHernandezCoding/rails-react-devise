FROM ruby:3.3.0

WORKDIR /app

# Install OS packages commonly required by Rails apps
RUN apt-get update -qq \
    && apt-get install -y --no-install-recommends build-essential libpq-dev nodejs postgresql-client curl \
    && rm -rf /var/lib/apt/lists/*

# Set bundler version (will be a no-op if already present)
RUN gem install bundler -v "2.4.15" || true

# Copy Gemfile first to leverage Docker layer caching
COPY Gemfile Gemfile.lock ./
RUN bundle config set --local deployment 'false' \
    && bundle install --jobs=4 --retry=3

# Copy application code
COPY . .

ENV RAILS_ENV=development

# Expose default Rails port (container)
EXPOSE 3000

# Default command runs the Rails dev server; when using docker-compose we map host:container ports
ENV RAILS_PORT=3000
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["bin/rails", "server", "-b", "0.0.0.0", "-p", "${RAILS_PORT}"]
