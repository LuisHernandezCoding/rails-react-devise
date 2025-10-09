# frozen_string_literal: true

namespace :assets do
  desc 'Build frontend (pnpm) and copy built files into backend/public'
  task :build_frontend do
    frontend_dir = File.expand_path('../../../frontend', __dir__)
    public_dir = File.expand_path('../../public', __dir__)

    unless File.directory?(frontend_dir)
      puts "No frontend directory found at #{frontend_dir}, skipping frontend build"
      next
    end

    Dir.chdir(frontend_dir) do
      if system('pnpm --version > /dev/null 2>&1')
        puts 'Running pnpm install --frozen-lockfile'
        system('pnpm install --frozen-lockfile')
        puts 'Running pnpm build'
        unless system('pnpm build')
          raise 'Frontend build failed. See pnpm output.'
        end
      else
        raise 'pnpm is not installed. Install pnpm to build the frontend.'
      end
    end

    dist_dir = File.join(frontend_dir, 'dist')
    unless File.directory?(dist_dir)
      raise "Frontend build directory not found at #{dist_dir}"
    end

    # Clear public directory (except existing Rails assets subfolders)
    puts "Copying frontend build (#{dist_dir}) to Rails public directory (#{public_dir})"
    FileUtils.rm_rf(Dir.glob(File.join(public_dir, '*')))
    FileUtils.cp_r(dist_dir + '/.', public_dir)
    puts 'Frontend assets copied to backend/public'
  end
end
