# frozen_string_literal: true

require "simplecov"
if ENV["COVERAGE"]
  SimpleCov.start "rails" do
    add_filter "/bin/"
    add_filter "/db/"
    add_filter "/spec/" # for rspec
    add_filter "/config/"
    add_filter "/lib/"
    add_filter "/vendor/"

    add_group "Controllers", "app/controllers"
    add_group "Models", "app/models"
    add_group "Mailers", "app/mailers"
    add_group "Jobs", "app/jobs"
    add_group "Helpers", "app/helpers"

    minimum_coverage 90
  end
end

RSpec.configure do |config|
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end

  config.shared_context_metadata_behavior = :apply_to_host_groups
end
