export const patterns = [
  // Ignore the roots and go down the tree by negating hand written files
  'specs/bundled/*.yml',
  'specs/bundled/*.json',

  'clients/**',
  'docs/**',
  'docs/**/.*',
  'docs/**/.*/**',
  '!docs/README.md',
  '!clients/README.md',
  '!clients/AGENTS.md',
  '!clients/**/.openapi-generator-ignore',
  'clients/**/.github/**',
  '!clients/**/.github/workflows/release.yml',
  '!clients/**/AGENTS.md',

  // C#
  'clients/flapjack-search-csharp/**',
  '!clients/flapjack-search-csharp/*',
  '!clients/flapjack-search-csharp/flapjacksearch/Clients/FlapjackConfig.cs',
  '!clients/flapjack-search-csharp/flapjacksearch/Exceptions/**',
  '!clients/flapjack-search-csharp/flapjacksearch/Serializer/**',
  '!clients/flapjack-search-csharp/flapjacksearch/Utils/**',
  '!clients/flapjack-search-csharp/flapjacksearch/Http/**',
  '!clients/flapjack-search-csharp/flapjacksearch/Transport/**',
  '!clients/flapjack-search-csharp/flapjacksearch/Models/Common/**',

  'tests/output/csharp/src/Flapjack.Search.Tests.csproj',
  '!tests/output/csharp/src/TimeoutIntegrationTests.cs',

  // Dart
  '!clients/flapjack-search-dart/**',
  'clients/flapjack-search-dart/packages/*/pubspec.yaml',
  'clients/flapjack-search-dart/packages/*/lib/*.dart',
  'clients/flapjack-search-dart/packages/*/lib/src/*.dart',
  'clients/flapjack-search-dart/packages/client_core/pubspec.yaml',
  'clients/flapjack-search-dart/packages/*/lib/src/api/**',
  'clients/flapjack-search-dart/packages/*/lib/src/model/**',
  '!clients/flapjack-search-dart/packages/client_core/**',
  'clients/flapjack-search-dart/packages/client_core/lib/src/version.dart',
  '!clients/flapjack-search-dart/packages/*/lib/src/extension.dart',
  '!clients/flapjack-search-dart/packages/flapjack_search/lib/flapjack_search.dart',

  // GO
  'clients/flapjack-search-go/flapjack/**',
  '!clients/flapjack-search-go/*',
  '!clients/flapjack-search-go/flapjack/transport/**',
  '!clients/flapjack-search-go/flapjack/errs/**',
  '!clients/flapjack-search-go/flapjack/call/*',
  '!clients/flapjack-search-go/flapjack/compression/*',
  '!clients/flapjack-search-go/flapjack/debug/*',
  '!clients/flapjack-search-go/flapjack/utils/*',

  'tests/output/go/go.mod',

  // Java
  '!clients/flapjack-search-java/**',
  'clients/flapjack-search-java/gradle.properties',
  'clients/flapjack-search-java/flapjacksearch/src/main/java/com/flapjackhq/api/**',
  'clients/flapjack-search-java/flapjacksearch/src/main/java/com/flapjackhq/model/**',
  'clients/flapjack-search-java/flapjacksearch/src/main/java/com/flapjackhq/BuildConfig.java',

  'tests/output/java/build.gradle',

  // JavaScript
  '!clients/flapjack-search-javascript/*',
  '!clients/flapjack-search-javascript/.yarn/**',
  '!clients/flapjack-search-javascript/scripts/**',
  '!clients/flapjack-search-javascript/tests/**',
  // the release process is allowed to push changes to this file, but in general we don't because those files are generated
  process.env.RELEASE
    ? '!clients/flapjack-search-javascript/packages/**/package.json'
    : 'clients/flapjack-search-javascript/packages/**/package.json',
  '!clients/flapjack-search-javascript/packages/requester-*/**',
  '!clients/flapjack-search-javascript/packages/client-common/**',
  '!clients/flapjack-search-javascript/packages/logger-console/**',
  '!clients/flapjack-search-javascript/packages/flapjack-search/__tests__/**',
  '!clients/flapjack-search-javascript/packages/flapjack-search/vitest.config.ts',

  'tests/output/javascript/package.json',
  '!tests/output/javascript/yarn.lock',

  // Kotlin
  '!clients/flapjack-search-kotlin/**',
  'clients/flapjack-search-kotlin/gradle.properties',
  'clients/flapjack-search-kotlin/client/README.md',
  'clients/flapjack-search-kotlin/client-bom/README.md',
  'clients/flapjack-search-kotlin/client/src/commonMain/kotlin/com/flapjackhq/client/BuildConfig.kt',
  'clients/flapjack-search-kotlin/client/src/commonMain/kotlin/com/flapjackhq/client/api/**',
  'clients/flapjack-search-kotlin/client/src/commonMain/kotlin/com/flapjackhq/client/model/**',

  // PHP
  '!clients/flapjack-search-php/**',
  '!clients/flapjack-search-php/tests/**',
  'clients/flapjack-search-php/lib/Api/*',
  'clients/flapjack-search-php/lib/Model/**',
  '!clients/flapjack-search-php/lib/Model/AbstractModel.php',
  '!clients/flapjack-search-php/lib/Model/ModelInterface.php',
  'clients/flapjack-search-php/lib/Configuration/*',
  '!clients/flapjack-search-php/lib/Configuration/Configuration.php',
  '!clients/flapjack-search-php/lib/Configuration/ConfigWithRegion.php',
  'clients/flapjack-search-php/composer.json',

  // Python
  'clients/flapjack-search-python/**',
  '!clients/flapjack-search-python/flapjacksearch/http/**',
  '!clients/flapjack-search-python/flapjacksearch/tests/**',
  '!clients/flapjack-search-python/flapjacksearch/py.typed',
  'clients/flapjack-search-python/flapjacksearch/http/__init__.py',
  '!clients/flapjack-search-python/*',
  'clients/flapjack-search-python/pyproject.toml',
  'clients/flapjack-search-python/poetry.lock',
  'clients/flapjack-search-python/requirements.txt',
  'clients/flapjack-search-python/.gitignore',

  'tests/output/python/poetry.lock',
  '!tests/output/python/**/__init__.py',
  'tests/output/python/requirements.txt',

  // Ruby
  '!clients/flapjack-search-ruby/**',
  'clients/flapjack-search-ruby/Gemfile.lock',
  'clients/flapjack-search-ruby/lib/flapjack/**',
  '!clients/flapjack-search-ruby/lib/flapjack/api_client.rb',
  '!clients/flapjack-search-ruby/lib/flapjack/api_error.rb',
  '!clients/flapjack-search-ruby/lib/flapjack/defaults.rb',
  '!clients/flapjack-search-ruby/lib/flapjack/error.rb',
  '!clients/flapjack-search-ruby/lib/flapjack/configuration.rb',
  '!clients/flapjack-search-ruby/lib/flapjack/logger_helper.rb',
  '!clients/flapjack-search-ruby/lib/flapjack/user_agent.rb',
  '!clients/flapjack-search-ruby/lib/flapjack/transport/**',

  'tests/output/ruby/Gemfile.lock',

  // Scala
  '!clients/flapjack-search-scala/**',
  'clients/flapjack-search-scala/version.sbt',
  'clients/flapjack-search-scala/src/main/scala/flapjacksearch/**',
  '!clients/flapjack-search-scala/src/main/scala/flapjacksearch/ApiClient.scala',
  '!clients/flapjack-search-scala/src/main/scala/flapjacksearch/exception/**',
  '!clients/flapjack-search-scala/src/main/scala/flapjacksearch/internal/**',
  '!clients/flapjack-search-scala/src/main/scala/flapjacksearch/config/**',
  '!clients/flapjack-search-scala/src/main/scala/flapjacksearch/extension/**',

  // Swift
  'clients/flapjack-search-swift/**',
  '!clients/flapjack-search-swift/*',
  'clients/flapjack-search-swift/FlapjackSearchClient.podspec',
  'clients/flapjack-search-swift/Package.swift',
  'clients/flapjack-search-swift/**/Sources/**',
  '!clients/flapjack-search-swift/Sources/Core/**',
  'clients/flapjack-search-swift/Sources/Core/Helpers/Version.swift',
  'clients/flapjack-search-swift/Sources/Search/**',
  '!clients/flapjack-search-swift/Sources/Search/Extra/**',
  '!clients/flapjack-search-swift/Sources/zlib/**',

  'tests/output/swift/Package.swift',
  '!tests/output/swift/manual/**',
  '!tests/output/swift/Utils/**',

  'clients/**/LICENSE',

  'yarn.lock',
];
