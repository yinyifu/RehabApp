// swift-tools-version:4.0
import PackageDescription

let package = Package(
  name: "RehabApp",
  dependencies: [
    .package(url: "https://github.com/ReactiveX/RxSwift.git", "4.0.0" ..< "5.0.0")
  ],
  targets: [
    .target(name: "RehabApp", dependencies: ["RxSwift", "RxCocoa"])
  ]
)
